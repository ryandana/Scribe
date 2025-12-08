"use client";
import FollowingTab from "@/components/ui/profile-tabs/following.tab";

export default function FollowingPage() {
    return (
        <div className="space-y-6">
            <h2 className="card-title text-2xl">Following</h2>
            <FollowingTab />
        </div>
    );
}
