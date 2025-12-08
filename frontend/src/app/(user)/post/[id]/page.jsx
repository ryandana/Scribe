import Section from "@/components/atoms/section.component";
import timeAgo from "@/lib/timeAgo";
import Image from "next/image";
import api from "@/lib/api";
import ReactMarkdown from "react-markdown";
import { getImageUrl } from "@/lib/imageUrl";
import { IconEye } from "@tabler/icons-react";
import CommentSection from "@/components/ui/comment-section.component";
import VoteControl from "@/components/ui/vote-control.component";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

async function getPost(id) {
    try {
        const data = await api.get(`/api/posts/${id}`);
        return data;
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const post = await getPost(id);

    if (!post) {
        return (
            <Section className="py-24 text-center">
                <h1 className="text-2xl font-bold">Post not found</h1>
            </Section>
        );
    }

    return (
        <Section className="py-24">
            <div className="mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            {post.author?.avatar_url && (
                                <Image
                                    src={getImageUrl(post.author.avatar_url)}
                                    width={24}
                                    height={24}
                                    className="rounded-full"
                                    alt={post.author.nickname || "Author"}
                                    unoptimized
                                />
                            )}
                            <span className="font-semibold text-gray-900">
                                {post.author?.nickname || "Unknown Author"}
                            </span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        {post.title}
                    </h1>
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2">
                            {post.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                    <div className="divider"></div>
                    <div className="flex w-full justify-between">
                        <div className="flex items-center gap-6 md:text-base text-sm">
                            <div className="flex items-center gap-1">
                                <IconEye size={18} />
                                <span>{post.views || 0}</span>
                                <span>Views</span>
                            </div>
                            <div>
                                <span>{timeAgo(post.createdAt)}</span>
                            </div>
                            <div>
                                <span>{post.readingTime || 1} min read</span>s
                            </div>
                        </div>
                        <div className="md:block hidden">
                            <VoteControl post={post} size={18} />
                        </div>
                    </div>
                    <div className="md:hidden block">
                        <VoteControl post={post} size={18} />
                    </div>
                    <div className="divider"></div>


                </div>

                {/* Thumbnail */}
                {post.thumbnail_url && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                        <Image
                            src={getImageUrl(post.thumbnail_url)}
                            alt={post.title}
                            fill
                            unoptimized
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                {/* Content */}
                <article className="prose prose-lg prose-blue max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
                    >
                        {post.body}
                    </ReactMarkdown>
                </article>

                <CommentSection postId={post._id} />
            </div>
        </Section>
    );
}
