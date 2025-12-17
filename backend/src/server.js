import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import postsRoutes from "./routes/post.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
dbConnect();

// Allow requests from the frontend. Configure `CLIENT_URL` in .env for production.
const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.CLIENT_DOCKER_URL,
    process.env.NGROK_URL,
];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("CORS blocked: " + origin));
            }
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("public/uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
