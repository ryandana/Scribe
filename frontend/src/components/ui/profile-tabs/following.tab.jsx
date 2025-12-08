"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/avatar.component";
import { getImageUrl } from "@/lib/imageUrl";
import { IconUsers, IconUserMinus, IconCheck } from "@tabler/icons-react";
import api from "@/lib/api";
import { useAuth } from "@/context/auth.context";
import UserListSkeleton from "@/components/skeletons/user-list.skeleton";

function FollowingUserItem({ user, currentUser, onUnfollow }) {
    const [isLoading, setIsLoading] = useState(false);

    const isOwnProfile = currentUser?.username === user.username;

    const handleUnfollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser || isLoading) return;

        setIsLoading(true);
        try {
            await api.post(`/api/users/${user.username}/follow`);
            if (onUnfollow) onUnfollow(user.username);
        } catch (error) {
            console.error("Error unfollowing:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Link
            href={`/${user.username}`}
            className="flex items-center gap-4 p-4 rounded-lg border border-base-200 hover:border-neutral hover:shadow-md transition-all group"
        >
            <Avatar
                src={getImageUrl(user.avatar_url)}
                alt={user.nickname || user.username}
                size={56}
                className="ring-2 ring-base-200 group-hover:ring-neutral/30"
            />
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate group-hover:text-neutral transition-colors">
                    {user.nickname || user.username}
                </h3>
                <p className="text-sm text-base-content/60 truncate">@{user.username}</p>
                {user.bio && (
                    <p className="text-sm text-base-content/50 truncate mt-1">{user.bio}</p>
                )}
            </div>
            {currentUser && !isOwnProfile && (
                <button
                    onClick={handleUnfollow}
                    disabled={isLoading}
                    className="btn btn-sm btn-outline hover:btn-error gap-1.5 shrink-0"
                >
                    {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                        <>
                            <IconCheck size={14} />
                            Following
                        </>
                    )}
                </button>
            )}
        </Link>
    );
}

export default function FollowingTab() {
    const { user: currentUser } = useAuth();
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFollowing = async () => {
        if (!currentUser) return;

        try {
            const data = await api.get(`/api/users/${currentUser.username}/following`);
            setFollowing(data.following || []);
        } catch (err) {
            console.error("Error fetching following:", err);
            setError("Failed to load following list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowing();
    }, [currentUser]);

    const handleUnfollow = (username) => {
        setFollowing(following.filter(u => u.username !== username));
    };

    if (loading) {
        return <UserListSkeleton count={3} />;
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>{error}</span>
            </div>
        );
    }

    if (following.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-base-200 rounded-full mb-4">
                    <IconUsers size={40} className="text-base-content/40" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Not following anyone</h3>
                <p className="text-base-content/60 max-w-sm mb-6">
                    When you follow people, they'll appear here.
                </p>
                <Link href="/explore" className="btn btn-neutral btn-sm">
                    Discover People
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {following.map((user) => (
                <FollowingUserItem
                    key={user._id || user.username}
                    user={user}
                    currentUser={currentUser}
                    onUnfollow={handleUnfollow}
                />
            ))}
        </div>
    );
}
