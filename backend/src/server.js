import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// import { seedSuperAdmin } from "./seed/admin.seed.js";

import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import classRoutes from "./routes/class.routes.js";
import examRoutes from "./routes/exam.routes.js";
import questionRoutes from "./routes/question.route.js";
import studentAnswerRoutes from "./routes/studentAnswer.routes.js";

dotenv.config();

const app = express();
await dbConnect();

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
app.use(
    cors({
        origin: clientUrl,
        credentials: true,
    })
);

// seedSuperAdmin();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/studentAnswers", studentAnswerRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
