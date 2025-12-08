"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import PostsList from "@/components/ui/posts-list.component";
import { IconTrash, IconPencil, IconDots } from "@tabler/icons-react";
import Link from "next/link";
import { useConfirm } from "@/context/confirm.context";
import { useToast } from "@/context/toast.context";
import PostsListSkeleton from "@/components/skeletons/posts-list.skeleton";

export default function MyPostsTab() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const confirm = useConfirm();
    const { addToast } = useToast();

    const fetchMyPosts = async () => {
        try {
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

    const handleDelete = async (postId) => {
        const isConfirmed = await confirm({
            title: "Delete Post",
            message: "Are you sure you want to delete this post? This action cannot be undone.",
            confirmLabel: "Delete",
            variant: "danger"
        });

        if (!isConfirmed) return;

        try {
            await api.delete(`/api/posts/${postId}`);
            setPosts(posts.filter(p => p._id !== postId));
            addToast("Post deleted successfully", "success");
        } catch (error) {
            console.error(error);
            addToast("Failed to delete post", "error");
        }
    }

    if (loading) return <PostsListSkeleton count={3} />;

    return (
        <div className="space-y-4">
            {posts.length === 0 ? (
                <div className="text-center py-10">
                    <p>You haven't posted anything yet.</p>
                    <Link href="/write" className="btn btn-neutral mt-4">Write your first post</Link>
                </div>
            ) : (
                <div className="space-y-8">
                    {posts.map(post => (
                        <div key={post._id} className="relative group">
                            <div className="absolute right-2 top-2 z-10">
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
                                        <IconDots size={18} />
                                    </div>
                                    <ul tabIndex={0} className="dropdown-content z-1 menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li>
                                            <Link href={`/write?edit=${post._id}`} className="flex items-center gap-2">
                                                <IconPencil size={16} />
                                                Edit
                                            </Link>
                                        </li>
                                        <li>
                                            <button onClick={() => handleDelete(post._id)} className="flex items-center gap-2 text-error">
                                                <IconTrash size={16} />
                                                Delete
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <PostsList posts={[post]} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
