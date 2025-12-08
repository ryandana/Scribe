import User from "../models/user.model.js";
import Post from "../models/post.model.js";

// Search users by username or nickname
export const searchUsers = async (req, res) => {
    try {
        const { search } = req.query;

        if (!search || search.trim() === "") {
            return res.status(200).json({ users: [] });
        }

        const users = await User.find({
            $or: [
                { username: { $regex: search, $options: "i" } },
                { nickname: { $regex: search, $options: "i" } },
            ],
        })
            .select("username nickname avatar_url followers following bio")
            .limit(20);

        res.status(200).json({ count: users.length, users });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get user by username
export const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username })
            .select(
                "username nickname avatar_url followers following bio createdAt"
            )
            .populate("followers", "username nickname avatar_url")
            .populate("following", "username nickname avatar_url");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get posts by username
export const getUserPosts = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const posts = await Post.find({ author: user._id })
            .populate("author", "username nickname avatar_url")
            .sort({ createdAt: -1 });

        res.status(200).json({ count: posts.length, posts });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Follow or unfollow a user
export const toggleFollow = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { username } = req.params;

        // Find target user
        const targetUser = await User.findOne({ username });
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Can't follow yourself
        if (targetUser._id.toString() === currentUserId) {
            return res
                .status(400)
                .json({ message: "You cannot follow yourself" });
        }

        const currentUser = await User.findById(currentUserId);

        const isFollowing = currentUser.following.includes(targetUser._id);

        if (isFollowing) {
            // Unfollow
            currentUser.following = currentUser.following.filter(
                (id) => id.toString() !== targetUser._id.toString()
            );
            targetUser.followers = targetUser.followers.filter(
                (id) => id.toString() !== currentUserId
            );
        } else {
            // Follow
            currentUser.following.push(targetUser._id);
            targetUser.followers.push(currentUserId);
        }

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({
            message: isFollowing
                ? "Unfollowed successfully"
                : "Followed successfully",
            isFollowing: !isFollowing,
            followersCount: targetUser.followers.length,
            followingCount: targetUser.following.length,
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Check if current user is following a user
export const checkFollowStatus = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const { username } = req.params;

        const targetUser = await User.findOne({ username });
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentUser = await User.findById(currentUserId);
        const isFollowing = currentUser.following.includes(targetUser._id);

        res.status(200).json({ isFollowing });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get followers of a user
export const getFollowers = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username }).populate(
            "followers",
            "username nickname avatar_url bio"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            count: user.followers.length,
            followers: user.followers,
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get following of a user
export const getFollowing = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username }).populate(
            "following",
            "username nickname avatar_url bio"
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            count: user.following.length,
            following: user.following,
        });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get recommended users (users not followed by the current user)
export const getRecommendedUsers = async (req, res) => {
    try {
        const userId = req.user?.id;
        const limit = parseInt(req.query.limit) || 5;

        let excludeIds = [];

        if (userId) {
            const currentUser = await User.findById(userId);
            if (currentUser) {
                excludeIds = [...currentUser.following, userId];
            }
        }

        // Find users that the current user is not following
        const users = await User.find({
            _id: { $nin: excludeIds },
        })
            .select("username nickname avatar_url followers following bio")
            .sort({ followers: -1 }) // Sort by most followers
            .limit(limit);

        res.status(200).json({ count: users.length, users });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Get popular posts (sorted by likes count)
export const getPopularPosts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;

        const posts = await Post.aggregate([
            {
                $addFields: {
                    likesCount: { $size: { $ifNull: ["$likes", []] } },
                },
            },
            { $sort: { likesCount: -1, views: -1, createdAt: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                },
            },
            { $unwind: "$author" },
            {
                $project: {
                    title: 1,
                    body: 1,
                    thumbnail_url: 1,
                    tags: 1,
                    views: 1,
                    likes: 1,
                    dislikes: 1,
                    readingTime: 1,
                    createdAt: 1,
                    "author.username": 1,
                    "author.nickname": 1,
                    "author.avatar_url": 1,
                },
            },
        ]);

        res.status(200).json({ count: posts.length, posts });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
