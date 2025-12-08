"use client";
import FollowersTab from "@/components/ui/profile-tabs/followers.tab";

export default function FollowersPage() {
    return (
        <div className="space-y-6">
            <h2 className="card-title text-2xl">Followers</h2>
            <FollowersTab />
        </div>
    );
}
