"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/avatar.component";
import { getImageUrl } from "@/lib/imageUrl";
import { IconUserPlus, IconCheck, IconUsers, IconSparkles } from "@tabler/icons-react";
import api from "@/lib/api";
import { useAuth } from "@/context/auth.context";

function UserRecommendationItem({ user, onFollowChange }) {
    const { user: currentUser } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleFollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser || isLoading) return;

        setIsLoading(true);
        try {
            const data = await api.post(`/api/users/${user.username}/follow`);
            setIsFollowing(data.isFollowing);
            if (onFollowChange) onFollowChange(user.username, data.isFollowing);
        } catch (error) {
            console.error("Error toggling follow:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200/50 transition-colors group">
            <Link href={`/${user.username}`} className="shrink-0">
                <Avatar
                    src={getImageUrl(user.avatar_url)}
                    alt={user.nickname || user.username}
                    size={44}
                    className="ring-2 ring-base-200 group-hover:ring-neutral/20 transition-all"
                />
            </Link>
            <div className="flex-1 min-w-0">
                <Link href={`/${user.username}`} className="block">
                    <h4 className="font-semibold truncate group-hover:text-neutral transition-colors">
                        {user.nickname || user.username}
                    </h4>
                    <p className="text-xs text-base-content/60 truncate">@{user.username}</p>
                </Link>
                {user.bio && (
                    <p className="text-xs text-base-content/50 truncate mt-0.5">{user.bio}</p>
                )}
            </div>
            {currentUser && currentUser.username !== user.username && (
                <button
                    onClick={handleToggleFollow}
                    disabled={isLoading}
                    className={`btn btn-sm gap-1.5 shrink-0 ${isFollowing
                        ? "btn-outline hover:btn-error"
                        : "btn-neutral"
                        }`}
                >
                    {isLoading ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : isFollowing ? (
                        <>
                            <IconCheck size={14} />
                            <span className="hidden sm:inline">Following</span>
                        </>
                    ) : (
                        <>
                            <IconUserPlus size={14} />
                            <span className="hidden sm:inline">Follow</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

export default function UserRecommendationCard({ limit = 5, showHeader = true }) {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendedUsers = async () => {
            try {
                const data = await api.get(`/api/users/recommended?limit=${limit}`);
                setUsers(data.users || []);
            } catch (error) {
                console.error("Error fetching recommended users:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchRecommendedUsers();
        } else {
            setLoading(false);
        }
    }, [currentUser, limit]);

    const handleFollowChange = (username, isFollowing) => {
        if (isFollowing) {
            // Remove the user from recommendations when followed
            setUsers(users.filter(u => u.username !== username));
        }
    };

    if (loading) {
        return (
            <div className="card bg-base-100 border border-base-200">
                <div className="card-body">
                    {showHeader && (
                        <div className="flex items-center gap-2 mb-3">
                            <IconUsers size={20} className="text-neutral" />
                            <h3 className="font-bold">Who to Follow</h3>
                        </div>
                    )}
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="skeleton w-11 h-11 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="skeleton h-4 w-24"></div>
                                    <div className="skeleton h-3 w-16"></div>
                                </div>
                                <div className="skeleton w-16 h-8 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (users.length === 0) {
        return null;
    }

    return (
        <div className="card bg-base-100 border border-base-200">
            <div className="card-body p-4">
                {showHeader && (
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <IconUsers size={20} className="text-neutral" />
                            <h3 className="font-bold">Who to Follow</h3>
                        </div>
                        <Link
                            href="/explore"
                            className="text-xs text-neutral hover:underline"
                        >
                            See all
                        </Link>
                    </div>
                )}
                <div className="space-y-1 -mx-1">
                    {users.map((user) => (
                        <UserRecommendationItem
                            key={user._id || user.username}
                            user={user}
                            onFollowChange={handleFollowChange}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
