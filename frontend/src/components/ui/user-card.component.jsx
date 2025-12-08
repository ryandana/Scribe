"use client";

import Link from "next/link";
import Avatar from "@/components/ui/avatar.component";
import { getImageUrl } from "@/lib/imageUrl";

export default function UserCard({ user }) {
    return (
        <Link
            href={`/${user.username}`}
            className="card card-compact bg-base-100 border border-base-300 hover:border-primary hover:shadow-lg transition-all duration-200 group"
        >
            <div className="card-body flex-row items-center gap-4">
                <Avatar
                    src={getImageUrl(user.avatar_url)}
                    alt={user.nickname || user.username}
                    size={56}
                />
                <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                        {user.nickname || user.username}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                    {user.bio && (
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{user.bio}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>
                            <strong className="text-base-content">{user.followers?.length || 0}</strong> followers
                        </span>
                        <span>
                            <strong className="text-base-content">{user.following?.length || 0}</strong> following
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
