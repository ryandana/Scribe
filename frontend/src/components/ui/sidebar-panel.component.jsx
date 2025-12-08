"use client";

import { useState, useEffect } from "react";
import PostsLarge from "@/components/ui/posts-large.component";
import UserRecommendationCard from "@/components/ui/user-recommendation-card.component";
import api from "@/lib/api";

export default function SidebarPanel({ showPopularPosts = true, showRecommendations = true }) {
    const [popularPosts, setPopularPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularPosts = async () => {
            if (!showPopularPosts) {
                setLoading(false);
                return;
            }

            try {
                const data = await api.get("/api/users/popular-posts?limit=2");
                setPopularPosts(data.posts || []);
            } catch (error) {
                console.error("Error fetching popular posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularPosts();
    }, [showPopularPosts]);

    return (
        <div className="flex flex-col space-y-6">
            {/* User Recommendations */}
            {showRecommendations && <UserRecommendationCard limit={5} />}

            {/* Popular Posts */}
            {showPopularPosts && (
                <div className="space-y-3">
                    <h2 className="text-xl font-semibold">Popular Posts</h2>
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="animate-pulse space-y-3">
                                    <div className="aspect-video bg-base-200 rounded-lg"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-base-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-base-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : popularPosts.length > 0 ? (
                        <PostsLarge posts={popularPosts} />
                    ) : (
                        <div className="text-center py-8 text-base-content/60">
                            <p className="text-sm">No popular posts yet</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
