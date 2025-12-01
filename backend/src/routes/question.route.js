import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    addQuestion,
    getQuestionsForExam,
} from "../controllers/question.controller.js";

const r = express.Router();
r.post("/exam/:examId", authMiddleware, addQuestion);
r.get("/exam/:examId", authMiddleware, getQuestionsForExam);

export default r;
