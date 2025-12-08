"use client";
import { useState } from "react";
import { IconThumbUp, IconThumbDown } from "@tabler/icons-react";
import api from "@/lib/api";
import { useAuth } from "@/context/auth.context";

export default function VoteControl({ post, size = 16 }) {
    const { user } = useAuth();
    // Default to empty array if undefined
    const [likes, setLikes] = useState(post.likes || []);
    const [dislikes, setDislikes] = useState(post.dislikes || []);

    // Determine user status
    const userId = user?._id;
    const isLiked = userId && likes.includes(userId);
    const isDisliked = userId && dislikes.includes(userId);

    const handleVote = async (e, type) => {
        e.preventDefault(); // Prevent Link navigation
        if (!user) {
            // Maybe show toast? For now just return or console log
            console.log("Please login to vote");
            return;
        }

        // Optimistic update
        const prevLikes = [...likes];
        const prevDislikes = [...dislikes];

        if (type === 'like') {
            if (isLiked) {
                setLikes(likes.filter(id => id !== userId));
            } else {
                setLikes([...likes, userId]);
                if (isDisliked) setDislikes(dislikes.filter(id => id !== userId));
            }
        } else {
            if (isDisliked) {
                setDislikes(dislikes.filter(id => id !== userId));
            } else {
                setDislikes([...dislikes, userId]);
                if (isLiked) setLikes(likes.filter(id => id !== userId));
            }
        }

        try {
            await api.post(`/api/posts/${post._id}/vote`, { type });
        } catch (error) {
            console.error("Vote failed", error);
            // Revert
            setLikes(prevLikes);
            setDislikes(prevDislikes);
        }
    };

    return (
        <div className="flex items-center gap-3 text-base-content/70">
            <button
                onClick={(e) => handleVote(e, 'like')}
                className={`flex items-center gap-1 hover:text-primary transition-colors ${isLiked ? "text-primary" : ""}`}
                title="Like"
            >
                <IconThumbUp size={size} fill={isLiked ? "currentColor" : "none"} />
                <span className="text-sm">{likes.length}</span>
            </button>
            <button
                onClick={(e) => handleVote(e, 'dislike')}
                className={`flex items-center gap-1 hover:text-error transition-colors ${isDisliked ? "text-error" : ""}`}
                title="Dislike"
            >
                <IconThumbDown size={size} fill={isDisliked ? "currentColor" : "none"} />
                <span className="text-sm">{dislikes.length}</span>
            </button>
        </div>
    );
}
