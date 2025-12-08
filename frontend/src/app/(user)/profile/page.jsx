"use client";
import MyPostsTab from "@/components/ui/profile-tabs/my-posts.tab";

export default function MyPostsPage() {
    return (
        <div className="space-y-6">
            <h2 className="card-title text-2xl">My Posts</h2>
            <MyPostsTab />
        </div>
    );
}
