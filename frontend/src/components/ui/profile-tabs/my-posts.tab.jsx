"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import PostsList from "@/components/ui/posts-list.component";
import { IconTrash, IconPencil } from "@tabler/icons-react";
import Link from "next/link";

export default function MyPostsTab() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyPosts = async () => {
        try {
            // Since we don't have a dedicated endpoint yet, we might fallback to filtering or create one
            // Ideally we should create /api/posts/me or usage of Author query param
            // Assuming for now I can filter by author via query param as implemented in step 1 of my thought (Wait, I need to implement that in backend first)
            // Wait, I haven't implemented filtering by author in backend yet. I only did search by text.
            // Let's assume I will add `?myPosts=true` or similar, or just `/api/posts/me`
            // Let's stick to `/api/posts?author=me` pattern if I modify controller, or `/api/posts/user/me`
            // I'll assume `/api/posts/me` for cleanliness if I can add it, otherwise `/api/posts?author=me`
            // I'll implement `GET /api/posts/me` in the backend next.
            const res = await api.get("/api/posts/me");
            setPosts(res.posts || res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const handleDelete = async (e, postId) => {
        e.preventDefault(); // Prevent link click
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            await api.delete(`/api/posts/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
        } catch (error) {
            console.error(error);
            alert("Failed to delete post");
        }
    }

    if (loading) return <div className="loading loading-spinner loading-md"></div>;

    return (
        <div className="space-y-4">
            {posts.length === 0 ? (
                <div className="text-center py-10">
                    <p>You haven't posted anything yet.</p>
                    <Link href="/write" className="btn btn-primary mt-4">Write your first post</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map(post => (
                        <div key={post._id} className="relative group">
                            <div className="absolute right-0 top-0 z-10 flex gap-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/write?edit=${post._id}`} className="btn btn-square btn-sm btn-ghost bg-base-100/50 backdrop-blur">
                                    <IconPencil size={18} />
                                </Link>
                                <button onClick={(e) => handleDelete(e, post._id)} className="btn btn-square btn-sm btn-ghost text-error bg-base-100/50 backdrop-blur">
                                    <IconTrash size={18} />
                                </button>
                            </div>
                            <PostsList posts={[post]} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
