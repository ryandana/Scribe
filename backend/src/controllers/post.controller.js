import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { saveImage, deleteImage } from "../utils/fileHandler.js";

export const getAllPosts = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { body: { $regex: search, $options: "i" } },
                    { tags: { $regex: search, $options: "i" } },
                ],
            };
        }

        const posts = await Post.find(query)
            .populate("author", "username nickname avatar_url")
            .sort({ createdAt: -1 });

        res.status(200).json({ count: posts.length, posts });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getSinglePost = async (req, res) => {
    try {
        const findPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate("author", "username nickname avatar_url");
        if (!findPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(findPost);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createPost = async (req, res) => {
    try {
        const { title, body, userId, tags } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Thumbnail is required" });
        }

        const file = await saveImage(req.file.buffer);

        const plainText = body.replace(/<[^>]+>/g, " ");
        const words = plainText.trim().split(/\s+/).length;
        const readingTime = Math.ceil(words / 200);

        let parsedTags = tags;
        if (typeof tags === "string") {
            try {
                parsedTags = JSON.parse(tags);
            } catch (error) {
                // If parsing fails, assume it's a single tag or comma-separated
                parsedTags = tags.split(",").map((t) => t.trim());
            }
        }

        const newPost = await Post.create({
            title,
            body,
            author: userId,
            thumbnail_url: file.url,
            thumbnail_public_id: file.public_id,
            tags: parsedTags,
            readingTime,
        });

        return res.status(201).json({
            message: "Successfully created post",
            post: newPost,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const updatePost = async (req, res) => {
    try {
        const { title, body, tags } = req.body;

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        let imageUrl = post.thumbnail_url;
        let imagePublicId = post.thumbnail_public_id;

        // Only process new thumbnail if a file was uploaded
        if (req.file) {
            // delete old thumbnail
            if (post.thumbnail_public_id) {
                await deleteImage(post.thumbnail_public_id);
            }

            const file = await saveImage(req.file.buffer);
            imageUrl = file.url;
            imagePublicId = file.public_id;
        }

        // update reading time jika body berubah
        let readingTime = post.readingTime;
        if (body) {
            const plainText = body.replace(/<[^>]+>/g, " ");
            const words = plainText.trim().split(/\s+/).length;
            readingTime = Math.ceil(words / 200);
        }

        let parsedTags = tags;
        if (tags && typeof tags === "string") {
            try {
                parsedTags = JSON.parse(tags);
            } catch (error) {
                parsedTags = tags.split(",").map((t) => t.trim());
            }
        }

        post.title = title ?? post.title;
        post.body = body ?? post.body;
        post.tags = parsedTags ?? post.tags;
        post.thumbnail_url = imageUrl;
        post.thumbnail_public_id = imagePublicId;
        post.readingTime = readingTime;

        const updated = await post.save();

        return res.status(200).json({
            message: "Successfully updated post",
            post: updated,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);

        if (!deleted)
            return res.status(404).json({ message: "Post not found" });

        await deleteImage(deleted.thumbnail_public_id);

        return res.status(200).json({ message: "Post successfully deleted" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const toggleVote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { type } = req.body; // 'like' or 'dislike'

        if (!["like", "dislike"].includes(type)) {
            return res.status(400).json({ message: "Invalid vote type" });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Helper to check inclusion
        const liked = post.likes.includes(userId);
        const disliked = post.dislikes.includes(userId);

        if (type === "like") {
            if (liked) {
                // Remove like
                post.likes = post.likes.filter(
                    (uid) => uid.toString() !== userId
                );
            } else {
                // Add like, remove dislike if present
                post.likes.push(userId);
                if (disliked) {
                    post.dislikes = post.dislikes.filter(
                        (uid) => uid.toString() !== userId
                    );
                }
            }
        } else if (type === "dislike") {
            if (disliked) {
                // Remove dislike
                post.dislikes = post.dislikes.filter(
                    (uid) => uid.toString() !== userId
                );
            } else {
                // Add dislike, remove like if present
                post.dislikes.push(userId);
                if (liked) {
                    post.likes = post.likes.filter(
                        (uid) => uid.toString() !== userId
                    );
                }
            }
        }

        await post.save();

        return res.status(200).json({
            message: "Vote updated",
            likes: post.likes,
            dislikes: post.dislikes,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getMyPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await Post.find({ author: userId })
            .populate("author", "username nickname avatar_url")
            .sort({ createdAt: -1 });

        return res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getLikedPosts = async (req, res) => {
    try {
        const userId = req.user.id;
        const posts = await Post.find({ likes: userId })
            .populate("author", "username nickname avatar_url")
            .sort({ createdAt: -1 });

        return res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get posts from users that the current user follows
export const getFollowedPosts = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get the current user's following list
        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const followingIds = currentUser.following;

        if (followingIds.length === 0) {
            return res.status(200).json({ count: 0, posts: [] });
        }

        // Get posts from followed users
        const posts = await Post.find({ author: { $in: followingIds } })
            .populate("author", "username nickname avatar_url")
            .sort({ createdAt: -1 });

        return res.status(200).json({ count: posts.length, posts });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
