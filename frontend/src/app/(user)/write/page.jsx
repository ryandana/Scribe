"use client";

import Section from "@/components/atoms/section.component";
import Button from "@/components/ui/button.component";
import api from "@/lib/api";
import { useAuth } from "@/context/auth.context";
import { IconPhoto, IconSend, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { getImageUrl } from "@/lib/imageUrl";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { useToast } from "@/context/toast.context";
import AISidebar from "@/components/ui/ai-sidebar.component";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

function WritePageContent() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const fileInputRef = useRef(null);
    const descriptionRef = useRef(null);
    const { addToast } = useToast();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState(""); // This is the body
    const [tags, setTags] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!editId);
    const [error, setError] = useState("");
    const [selectedText, setSelectedText] = useState("");
    const [postAuthorUsername, setPostAuthorUsername] = useState(null);

    // Handle text selection in the description textarea
    const handleTextSelection = useCallback(() => {
        const textarea = descriptionRef.current;
        if (textarea) {
            const selected = textarea.value.substring(
                textarea.selectionStart,
                textarea.selectionEnd
            );
            setSelectedText(selected);
        }
    }, []);

    // Insert AI-generated text into the description
    const handleInsertAIText = useCallback((text) => {
        const textarea = descriptionRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newText = description.substring(0, start) + text + description.substring(end);
            setDescription(newText);
            addToast("Text inserted successfully!", "success");
        } else {
            // If no selection, append to end
            setDescription((prev) => prev + "\n\n" + text);
            addToast("Text appended to content!", "success");
        }
    }, [description, addToast]);

    useEffect(() => {
        if (editId) {
            const fetchPost = async () => {
                try {
                    setFetching(true);
                    const post = await api.get(`/api/posts/${editId}`);
                    setTitle(post.title);
                    setDescription(post.body);
                    setTags(post.tags.join(", "));
                    if (post.thumbnail_url) {
                        setThumbnailPreview(getImageUrl(post.thumbnail_url));
                    }
                    setPostAuthorUsername(post.author?.username);

                    // We must check if auth is still loading. 
                    // If authLoading is true, we don't know the user yet, so we cannot verify permission.
                    // This logic depends on `authLoading` being part of dependencies.
                    if (!authLoading && user && post.author._id !== user._id) {
                        addToast("You do not have permission to edit this post.", "error");
                        router.push("/feed");
                        return;
                    }
                } catch (err) {
                    console.error("Failed to fetch post for editing", err);
                    setError("Failed to load post data.");
                } finally {
                    setFetching(false);
                }
            };

            // Only fetch if auth is done or if we don't care about auth related checks for *fetching* 
            // but we DO care about auth check for *permission*.
            // Actually, we can fetch, and then check permission once user is loaded?
            // Or better: Re-run this effect when `authLoading` changes.
            if (!authLoading) {
                fetchPost();
            }
        }
    }, [editId, user, authLoading]);

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const removeThumbnail = () => {
        setThumbnail(null);
        setThumbnailPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Validation: slightly different for edit mode (thumbnail might not change)
        if (!title || !description) {
            setError("Please fill in Title and Body.");
            setLoading(false);
            return;
        }
        if (!editId && !thumbnail) {
            setError("Thumbnail is required for new posts.");
            setLoading(false);
            return;
        }


        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("body", description);
            if (thumbnail) {
                formData.append("thumbnail_url", thumbnail);
            }

            formData.append("userId", user?._id);

            formData.append("tags", JSON.stringify(tags.split(",").map(t => t.trim()).filter(Boolean)));

            if (editId) {
                await api.put(`/api/posts/${editId}`, formData);
                // Redirect to the post with username/postId pattern
                router.push(`/${postAuthorUsername || user?.username}/${editId}`);
            } else {
                const result = await api.post("/api/posts", formData);
                // Redirect to the new post with username/postId pattern
                router.push(`/${user?.username}/${result.post._id}`);
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to save post");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <Section className="py-24">
            <div className="mx-auto">
                {/* Breadcrumbs */}
                <div className="text-sm breadcrumbs mb-6">
                    <ul>
                        <li><Link href="/">Home</Link></li>
                        {editId && postAuthorUsername ? (
                            <>
                                <li><Link href={`/${postAuthorUsername}/${editId}`}>Post</Link></li>
                                <li>Edit</li>
                            </>
                        ) : (
                            <li>Write</li>
                        )}
                    </ul>
                </div>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">{editId ? "Edit Post" : "Write a Post"}</h1>
                    <p className="text-gray-500">Share your knowledge with the community</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Thumbnail Upload */}
                    <div className="relative">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleThumbnailChange}
                            accept="image/*"
                            className="hidden"
                            id="thumbnail-upload"
                        />
                        {!thumbnailPreview ? (
                            <label
                                htmlFor="thumbnail-upload"
                                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <IconPhoto size={48} className="text-gray-400 mb-2" />
                                <span className="text-gray-500 font-medium">Add a cover image</span>
                            </label>
                        ) : (
                            <div className="relative w-full h-64 rounded-lg overflow-hidden group">
                                <Image
                                    src={thumbnailPreview}
                                    alt="Thumbnail preview"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                <button
                                    type="button"
                                    onClick={removeThumbnail}
                                    className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-gray-700 transition-colors"
                                >
                                    <IconX size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <textarea
                            placeholder="Article Title..."
                            className="w-full text-4xl font-bold placeholder-gray-300 border-none focus:ring-0 resize-none bg-transparent outline-none p-0"
                            rows={1}
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <input
                            type="text"
                            placeholder="Add tags (separated by comma)..."
                            className="w-full text-sm text-gray-600 placeholder-gray-300 border-none focus:ring-0 bg-transparent outline-none p-0"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 min-h-[500px]">
                        {/* Editor */}
                        <div className="h-full">
                            <textarea
                                ref={descriptionRef}
                                placeholder="Tell your story..."
                                className="w-full h-full text-lg leading-relaxed placeholder-gray-300 border-none focus:ring-0 resize-none bg-transparent outline-none p-0 min-h-[500px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onSelect={handleTextSelection}
                                onMouseUp={handleTextSelection}
                            />
                        </div>

                        {/* Preview */}
                        <div className="h-full border-l pl-8 hidden md:block">
                            <div className="prose prose-lg max-w-none">
                                {description ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize, rehypeHighlight]}>
                                        {description}
                                    </ReactMarkdown>
                                ) : (
                                    <span className="text-gray-300">Preview...</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between pt-8 border-t gap-6 md:flex-row flex-col">
                        <Button type="button" onClick={() => router.back()} disabled={loading} className="w-full md:w-1/2 flex items" variant="outline">
                            {loading ? "Canceling..." : "Cancel"}
                        </Button>
                        <Button type="submit" disabled={loading} className="w-full md:w-1/2">
                            {loading ? "Publishing..." : (editId ? "Update" : "Publish")} <IconSend size={18} className="ml-2" />
                        </Button>
                    </div>
                </form>
            </div>

            {/* AI Writing Assistant Sidebar */}
            <AISidebar
                selectedText={selectedText}
                documentContent={description}
                onInsertText={handleInsertAIText}
            />
        </Section>
    );
}

export default function WritePage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>}>
            <WritePageContent />
        </Suspense>
    );
}