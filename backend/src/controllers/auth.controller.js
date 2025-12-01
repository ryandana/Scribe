import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

export const register = async (req, res) => {
    try {
        const {
            email,
            username,
            password,
            role = "student",
            classId = null,
            nis,
        } = req.body;

        const existEmail = await User.findOne({ email });
        if (existEmail)
            return res.status(400).json({ message: "Email already exists" });

        const existUser = await User.findOne({ username });
        if (existUser)
            return res.status(400).json({ message: "Username already taken" });

        const hashedPassword = await bcrypt.hash(password, 12);

        const createUser = await User.create({
            email,
            username,
            nickname: username,
            password: hashedPassword,
            role,
            classId,
            nis: role === "student" ? nis : null,
        });

        const safeUser = createUser.toObject();
        delete safeUser.password;

        return res.status(201).json({
            message: "User registered successfully",
            user: safeUser,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        });

        const safeUser = user.toObject();
        delete safeUser.password;

        return res.status(200).json({
            message: "Login successful",
            safeUser,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: " Internal Server error",
        });
    }
};

export const check = (req, res) => {
    try {
        return res.json(req.user);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: " Internal Server error",
        });
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
        });
        return res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: " Internal Server error",
        });
    }
};

export const update = async (req, res) => {
    try {
        const { email, username, nickname, password } = req.body;
        const user = req.user;

        if (email) user.email = email;
        if (username) user.username = username;
        if (nickname) user.nickname = nickname;
        if (password) {
            user.password = await bcrypt.hash(password, 12);
        }

        await user.save();

        const safeUser = user.toObject();
        delete safeUser.password;

        return res.status(200).json({
            message: "User updated successfully",
            user: safeUser,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: " Internal Server error",
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate("classId").select("-password");

        return res.status(200).json({
            message: "Users fetched successfully",
            data: users,
            meta: {
                count: users.length,
            },
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
