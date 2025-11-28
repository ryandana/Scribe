import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const exist = await User.findOne({ email });

        if (exist) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const createUser = await User.create({ email, username, nickname: username, password: hashedPassword });

        return res.status(201).json(createUser);

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: " Internal Server error"
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN })

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000
        });

        const safeUser = user.toObject();
        delete safeUser.password;


        return res.status(200).json({
            message: "Login successful",
            safeUser
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: " Internal Server error"
        });
    }

}

export const check = (req, res) => {
    try {
        return res.json(req.user);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: " Internal Server error"
        });
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true
        });
        return res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: " Internal Server error"
        });
    }
}