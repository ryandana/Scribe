"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Avatar from "@/components/ui/avatar.component";
import { getImageUrl } from "@/lib/imageUrl";
import timeAgo from "@/lib/timeAgo";
import { useAuth } from "@/context/auth.context";
import { IconSend, IconTrash } from "@tabler/icons-react";

// Comment Item Component
const CommentItem = ({ comment, replies, addReply, deleteComment, currentUserId, depth = 0 }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState("");

    const handleReply = async (e) => {
        e.preventDefault();
        await addReply(comment._id, replyContent);
        setReplyContent("");
        setShowReplyForm(false);
    };

    return (
        <div className={`flex flex-col gap-2 ${depth > 0 ? "ml-8 md:ml-12 border-l-2 pl-4 border-base-200" : ""}`}>
            {/* Comment Display */}
            <div className="flex gap-3">
                <Avatar src={getImageUrl(comment.author?.avatar_url)} alt={comment.author?.nickname} size={32} />
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{comment.author?.nickname}</span>
                            <span className="text-xs text-base-content/60">{timeAgo(comment.createdAt)}</span>
                        </div>
                        {currentUserId === comment.author?._id && (
                            <button onClick={() => deleteComment(comment._id)} className="text-error btn btn-ghost btn-xs">
                                <IconTrash size={14} />
                            </button>
                        )}
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    <div className="flex items-center gap-4 pt-1">
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="text-xs font-semibold text-primary hover:text-primary-focus flex items-center gap-1"
                        >
                            Reply
                        </button>
                    </div>
                </div>
            </div>

            {/* Reply Form */}
            {showReplyForm && (
                <form onSubmit={handleReply} className="ml-10 flex gap-2">
                    <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="input input-sm input-bordered flex-1"
                        autoFocus
                    />
                    <button type="submit" disabled={!replyContent.trim()} className="btn btn-sm btn-primary">
                        Send
                    </button>
                </form>
            )}

            {/* Nested Replies */}
            {replies && replies.length > 0 && (
                <div className="flex flex-col gap-4 mt-2">
                    {replies.map(reply => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            replies={reply.children}
                            addReply={addReply}
                            deleteComment={deleteComment}
                            currentUserId={currentUserId}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    const fetchComments = async () => {
        try {
            const data = await api.get(`/api/comments/post/${postId}`);
            setComments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/api/comments/post/${postId}`, { content: newComment });
            setComments([res, ...comments]);
            setNewComment("");
        } catch (error) {
            console.error(error);
        }
    };

    const handleReply = async (parentId, content) => {
        try {
            const res = await api.post(`/api/comments/post/${postId}`, { content, parentId });
            setComments([...comments, res]);
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async (commentId) => {
        if (!confirm("Are you sure?")) return;
        try {
            await api.delete(`/api/comments/${commentId}`);
            fetchComments();
        } catch (error) {
            console.error(error);
        }
    }

    // Build tree
    const buildTree = (comments) => {
        const map = {};
        const roots = [];

        comments.forEach(c => {
            map[c._id] = { ...c, children: [] };
        });

        comments.forEach(c => {
            if (c.parent && map[c.parent]) {
                map[c.parent].children.push(map[c._id]);
            } else {
                if (map[c._id]) roots.push(map[c._id]);
            }
        });

        return roots;
    };

    const commentTree = buildTree(comments);

    return (
        <div className="space-y-6 pt-8 border-t border-base-200">
            <h3 className="text-xl font-bold">Comments ({comments.length})</h3>

            {user ? (
                <form onSubmit={handleSubmit} className="flex gap-4 items-start">
                    <Avatar src={getImageUrl(user.avatar_url)} alt={user.nickname} size={40} />
                    <div className="flex-1 flex gap-2 items-center">
                        <textarea
                            className="textarea textarea-bordered w-full resize-none"
                            placeholder="Add a comment..."
                            rows={2}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" disabled={!newComment.trim()} className="btn btn-primary rounded-full px-2"><IconSend/></button>
                    </div>
                </form>
            ) : (
                <div className="alert bg-base-200">
                    <span className="text-sm">Please login to join the discussion.</span>
                </div>
            )}

            <div className="space-y-6">
                {loading ? <p>Loading...</p> : commentTree.length > 0 ? (
                    commentTree.map(comment => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            replies={comment.children}
                            addReply={handleReply}
                            deleteComment={handleDelete}
                            currentUserId={user?._id}
                        />
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>
    );
}
