import Section from "@/components/atoms/section.component";
import timeAgo from "@/lib/timeAgo";
import Image from "next/image";
import api from "@/lib/api";
import ReactMarkdown from "react-markdown";
import { getImageUrl } from "@/lib/imageUrl";

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
        )
    }

    return (
        <Section className="py-24">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            {post.author?.avatar_url && (
                                <Image src={getImageUrl(post.author.avatar_url)} width={24} height={24} className="rounded-full" alt={post.author.nickname || "Author"} unoptimized />
                            )}
                            <span className="font-semibold text-gray-900">{post.author?.nickname || "Unknown Author"}</span>
                        </div>
                        <span>·</span>
                        <span>{timeAgo(post.createdAt)}</span>
                        <span>·</span>
                        <span>{post.readingTime || 1} min read</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>

                    {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2">
                            {post.tags.map((tag, idx) => (
                                <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Thumbnail */}
                {post.thumbnail_url && (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                        <Image src={getImageUrl(post.thumbnail_url)} alt={post.title} fill unoptimized className="object-cover" priority />
                    </div>
                )}

                {/* Content */}
                <article className="prose prose-lg prose-blue max-w-none">
                    <ReactMarkdown>{post.body}</ReactMarkdown>
                </article>
            </div>
        </Section>
    );
}
