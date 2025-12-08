"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import PostsList from "@/components/ui/posts-list.component";
import PostsListSkeleton from "@/components/skeletons/posts-list.skeleton";

export default function LikedPostsTab() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLikedPosts = async () => {
        try {
            const res = await api.get("/api/posts/liked");
            setPosts(res.posts || res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLikedPosts();
    }, []);

    if (loading) return <PostsListSkeleton count={3} />;

    return (
        <div className="space-y-8 flex flex-col">
            {posts.length === 0 ? (
                <div className="text-center py-10">
                    <p>You haven't liked any posts yet.</p>
                </div>
            ) : (
                <PostsList posts={posts} />
            )}
        </div>
    );
}
