import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    submitAnswers,
    autosaveAnswers,
    getStudentExamSubmission,
    getScoresByClass,
    getExamResults,
} from "../controllers/studentAnswer.controller.js";

const r = express.Router();

// Student answer routes
r.post("/:examId/submit", authMiddleware, submitAnswers);
r.post("/:examId/autosave", authMiddleware, autosaveAnswers);
r.get("/:examId", authMiddleware, getStudentExamSubmission);

// Teacher/Admin routes
r.get("/class/:classId/scores", authMiddleware, getScoresByClass);
r.get("/exam/:examId/results", authMiddleware, getExamResults);

export default r;
