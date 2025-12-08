"use client";

import { useState, useEffect } from "react";
import Section from "@/components/atoms/section.component";
import PostsList from "@/components/ui/posts-list.component";
import { IconUsers, IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import api from "@/lib/api";
import PostsListSkeleton from "@/components/skeletons/post-list.skeleton";

export default function FollowedPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFollowedPosts = async () => {
            try {
                const data = await api.get("/api/posts/followed");
                setPosts(data.posts || []);
            } catch (err) {
                console.error("Error fetching followed posts:", err);
                setError(err?.data?.message || "Failed to load posts");
            } finally {
                setLoading(false);
            }
        };

        fetchFollowedPosts();
    }, []);

    return (
        <Section className="py-24">
            <div className="flex w-full flex-col space-y-8">
                {/* Header */}
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl font-bold">Following Feed</h1>
                            <p className="text-sm text-base-content/60">
                                Posts from people you follow
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/explore"
                        className="btn btn-ghost btn-sm gap-1"
                    >
                        Explore More
                        <IconArrowRight size={16} />
                    </Link>
                </div>

                {/* Content */}
                {loading ? (
                    <PostsListSkeleton count={5} />
                ) : error ? (
                    <div className="alert alert-error">
                        <span>{error}</span>
                    </div>
                ) : posts.length > 0 ? (
                    <div className="space-y-6">
                        <PostsList posts={posts} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="p-4 bg-base-200 rounded-full mb-4">
                            <IconUsers size={48} className="text-base-content/40" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                            No posts yet
                        </h3>
                        <p className="text-base-content/60 max-w-md mb-6">
                            Start following people to see their posts here.
                            Discover interesting creators and build your personalized feed.
                        </p>
                        <Link href="/explore" className="btn btn-neutral gap-2">
                            <IconUsers size={18} />
                            Discover People
                        </Link>
                    </div>
                )}
            </div>
        </Section>
    );
}
