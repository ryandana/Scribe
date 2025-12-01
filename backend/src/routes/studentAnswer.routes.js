import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    submitAnswers,
    getScoresByClass,
} from "../controllers/studentAnswer.controller.js";

const r = express.Router();
r.post("/exam/:examId/submit", authMiddleware, submitAnswers);
r.get("/class/:classId/scores", authMiddleware, getScoresByClass);

export default r;
