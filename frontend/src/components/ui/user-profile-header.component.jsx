"use client";

import { useState, useEffect } from "react";
import Avatar from "@/components/ui/avatar.component";
import { getImageUrl } from "@/lib/imageUrl";
import { IconCalendar, IconUserPlus, IconCheck, IconX } from "@tabler/icons-react";
import api from "@/lib/api";
import { useAuth } from "@/context/auth.context";
import Link from "next/link";

function FollowListModal({ isOpen, onClose, title, users, currentUser, onFollowChange }) {
    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-md">
                <button
                    onClick={onClose}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                    <IconX size={18} />
                </button>
                <h3 className="font-bold text-lg mb-4">{title}</h3>

                {users.length === 0 ? (
                    <p className="text-center text-base-content/60 py-8">No users to show</p>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {users.map((user) => (
                            <FollowListItem
                                key={user._id || user.username}
                                user={user}
                                currentUser={currentUser}
                                onFollowChange={onFollowChange}
                                onClose={onClose}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
}

function FollowListItem({ user, currentUser, onFollowChange, onClose }) {
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
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200/50 transition-colors">
            <Link href={`/${user.username}`} onClick={onClose} className="shrink-0">
                <Avatar
                    src={getImageUrl(user.avatar_url)}
                    alt={user.nickname || user.username}
                    size={44}
                    className="ring-2 ring-base-200"
                />
            </Link>
            <Link href={`/${user.username}`} onClick={onClose} className="flex-1 min-w-0">
                <h4 className="font-semibold truncate hover:text-neutral transition-colors">
                    {user.nickname || user.username}
                </h4>
                <p className="text-xs text-base-content/60 truncate">@{user.username}</p>
            </Link>
            {currentUser && !isOwnProfile && (
                <button
                    onClick={handleToggleFollow}
                    disabled={isLoading || isCheckingStatus}
                    className={`btn btn-xs gap-1 shrink-0 ${isFollowing
                        ? "btn-outline hover:btn-error"
                        : "btn-neutral"
                        }`}
                >
                    {isLoading || isCheckingStatus ? (
                        <span className="loading loading-spinner loading-xs"></span>
                    ) : isFollowing ? (
                        <IconCheck size={12} />
                    ) : (
                        <IconUserPlus size={12} />
                    )}
                </button>
            )}
        </div>
    );
}

export default function UserProfileHeader({ user }) {
    const { user: currentUser } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(user.followers?.length || 0);
    const [followingCount, setFollowingCount] = useState(user.following?.length || 0);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);

    // Modal states
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [followersList, setFollowersList] = useState(user.followers || []);
    const [followingList, setFollowingList] = useState(user.following || []);

    const isOwnProfile = currentUser?.username === user.username;

    // Check follow status
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

    const handleToggleFollow = async () => {
        if (!currentUser || isLoading) return;

        setIsLoading(true);
        try {
            const data = await api.post(`/api/users/${user.username}/follow`);
            setIsFollowing(data.isFollowing);
            setFollowersCount(data.followersCount);
            setFollowingCount(data.followingCount);
        } catch (error) {
            console.error("Error toggling follow:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFollowers = async () => {
        try {
            const data = await api.get(`/api/users/${user.username}/followers`);
            setFollowersList(data.followers || []);
            setFollowersCount(data.count);
        } catch (error) {
            console.error("Error fetching followers:", error);
        }
    };

    const fetchFollowing = async () => {
        try {
            const data = await api.get(`/api/users/${user.username}/following`);
            setFollowingList(data.following || []);
            setFollowingCount(data.count);
        } catch (error) {
            console.error("Error fetching following:", error);
        }
    };

    const handleShowFollowers = () => {
        fetchFollowers();
        setShowFollowersModal(true);
    };

    const handleShowFollowing = () => {
        fetchFollowing();
        setShowFollowingModal(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    return (
        <>
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Avatar */}
                <div className="relative">
                    <Avatar
                        src={getImageUrl(user.avatar_url)}
                        alt={user.nickname || user.username}
                        size={120}
                        className="ring-4 ring-neutral/20"
                    />
                </div>

                {/* User Info */}
                <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">{user.nickname || user.username}</h1>
                            <p className="text-gray-500">@{user.username}</p>
                        </div>

                        {/* Follow Button */}
                        {currentUser && !isOwnProfile && (
                            <div className="md:ml-auto">
                                {isCheckingStatus ? (
                                    <button className="btn btn-outline btn-disabled">
                                        <span className="loading loading-spinner loading-sm"></span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleToggleFollow}
                                        disabled={isLoading}
                                        className={`btn gap-2 ${isFollowing
                                            ? "btn-outline hover:btn-error"
                                            : "btn-neutral"
                                            }`}
                                    >
                                        {isLoading ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : isFollowing ? (
                                            <>
                                                <IconCheck size={18} />
                                                Following
                                            </>
                                        ) : (
                                            <>
                                                <IconUserPlus size={18} />
                                                Follow
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Bio */}
                    {user.bio && (
                        <p className="text-gray-600 max-w-2xl">{user.bio}</p>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 text-sm">
                        <button
                            onClick={handleShowFollowers}
                            className="flex items-center gap-1 hover:text-neutral transition-colors cursor-pointer"
                        >
                            <strong className="text-lg">{followersCount}</strong>
                            <span className="text-gray-500">followers</span>
                        </button>
                        <button
                            onClick={handleShowFollowing}
                            className="flex items-center gap-1 hover:text-neutral transition-colors cursor-pointer"
                        >
                            <strong className="text-lg">{followingCount}</strong>
                            <span className="text-gray-500">following</span>
                        </button>
                        <div className="flex items-center gap-2 text-gray-500">
                            <IconCalendar size={16} />
                            <span>Joined {formatDate(user.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Followers Modal */}
            <FollowListModal
                isOpen={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                title="Followers"
                users={followersList}
                currentUser={currentUser}
                onFollowChange={fetchFollowers}
            />

            {/* Following Modal */}
            <FollowListModal
                isOpen={showFollowingModal}
                onClose={() => setShowFollowingModal(false)}
                title="Following"
                users={followingList}
                currentUser={currentUser}
                onFollowChange={fetchFollowing}
            />
        </>
    );
}
