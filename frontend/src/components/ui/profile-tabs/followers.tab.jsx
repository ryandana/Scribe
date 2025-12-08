"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/avatar.component";
import { getImageUrl } from "@/lib/imageUrl";
import { IconUsers, IconUserPlus, IconCheck } from "@tabler/icons-react";
import api from "@/lib/api";
import { useAuth } from "@/context/auth.context";

function FollowUserItem({ user, currentUser, onFollowChange }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);

    const isOwnProfile = currentUser?.username === user.username;

    useEffect(() => {
        const checkFollowStatus = async () => {
            if (!currentUser || isOwnProfile) {
                setIsCheckingStatus(false);
                return;
            }

            try {
                const data = await api.get(`/api/users/${user.username}/follow-status`);
                setIsFollowing(data.isFollowing);
            } catch (error) {
                console.error("Error checking follow status:", error);
            } finally {
                setIsCheckingStatus(false);
            }
        };

        checkFollowStatus();
    }, [currentUser, user.username, isOwnProfile]);

    const handleToggleFollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser || isLoading) return;

        setIsLoading(true);
        try {
            const data = await api.post(`/api/users/${user.username}/follow`);
            setIsFollowing(data.isFollowing);
            if (onFollowChange) onFollowChange();
        } catch (error) {
            console.error("Error toggling follow:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Link
            href={`/${user.username}`}
            className="flex items-center gap-4 p-4 rounded-lg border border-base-200 hover:border-primary hover:shadow-md transition-all group"
        >
            <Avatar
                src={getImageUrl(user.avatar_url)}
                alt={user.nickname || user.username}
                size={56}
                className="ring-2 ring-base-200 group-hover:ring-primary/30"
            />
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                    {user.nickname || user.username}
                </h3>
                <p className="text-sm text-base-content/60 truncate">@{user.username}</p>
                {user.bio && (
                    <p className="text-sm text-base-content/50 truncate mt-1">{user.bio}</p>
                )}
            </div>
            {currentUser && !isOwnProfile && (
                <button
                    onClick={handleToggleFollow}
                    disabled={isLoading || isCheckingStatus}
                    className={`btn btn-sm gap-1.5 shrink-0 ${isFollowing
                            ? "btn-outline hover:btn-error"
                            : "btn-primary"
                        }`}
                >
                    {isLoading || isCheckingStatus ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : isFollowing ? (
                        <>
                            <IconCheck size={14} />
                            Following
                        </>
                    ) : (
                        <>
                            <IconUserPlus size={14} />
                            Follow
                        </>
                    )}
                </button>
            )}
        </Link>
    );
}

export default function FollowersTab() {
    const { user: currentUser } = useAuth();
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFollowers = async () => {
        if (!currentUser) return;

        try {
            const data = await api.get(`/api/users/${currentUser.username}/followers`);
            setFollowers(data.followers || []);
        } catch (err) {
            console.error("Error fetching followers:", err);
            setError("Failed to load followers");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowers();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-base-200 animate-pulse">
                        <div className="w-14 h-14 rounded-full bg-base-200"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-5 bg-base-200 rounded w-32"></div>
                            <div className="h-4 bg-base-200 rounded w-24"></div>
                        </div>
                        <div className="w-20 h-8 bg-base-200 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error">
                <span>{error}</span>
            </div>
        );
    }

    if (followers.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-base-200 rounded-full mb-4">
                    <IconUsers size={40} className="text-base-content/40" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No followers yet</h3>
                <p className="text-base-content/60 max-w-sm">
                    When people follow you, they'll appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {followers.map((user) => (
                <FollowUserItem
                    key={user._id || user.username}
                    user={user}
                    currentUser={currentUser}
                    onFollowChange={fetchFollowers}
                />
            ))}
        </div>
    );
}
