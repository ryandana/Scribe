"use client";

import Section from "@/components/atoms/section.component";
import Button from "@/components/ui/button.component";
import api from "@/lib/api";
import { useAuth } from "@/context/auth.context";
import { IconPhoto, IconSend, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function WritePage() {
    const { user } = useAuth();
    const router = useRouter();
    const fileInputRef = useRef(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState(""); // This is the body
    const [tags, setTags] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

        if (!title || !description || !thumbnail) {
            setError("Please fill in all required fields (Title, Body, Thumbnail).");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("body", description);
            formData.append("thumbnail_url", thumbnail);
            formData.append("userId", user?._id);

            formData.append("tags", JSON.stringify(tags.split(",").map(t => t.trim()).filter(Boolean)));

            await api.post("/api/posts", formData);
            router.push("/feed");
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Section className="py-24">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Write a Post</h1>
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
                                placeholder="Tell your story..."
                                className="w-full h-full text-lg leading-relaxed placeholder-gray-300 border-none focus:ring-0 resize-none bg-transparent outline-none p-0 min-h-[500px]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Preview */}
                        <div className="h-full border-l pl-8 hidden md:block">
                            <div className="prose prose-lg max-w-none">
                                {description ? <ReactMarkdown>{description}</ReactMarkdown> : <span className="text-gray-300">Preview...</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-8 border-t">
                        <Button type="submit" disabled={loading} className="btn-primary">
                            {loading ? "Publishing..." : "Publish"} <IconSend size={18} className="ml-2" />
                        </Button>
                    </div>
                </form>
            </div>
        </Section>
    );
}