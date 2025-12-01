import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    addQuestion,
    getQuestionsForExam,
    getQuestionsByExamQuery,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
} from "../controllers/question.controller.js";

const r = express.Router();

// GET questions by query parameter
r.get("/", authMiddleware, getQuestionsByExamQuery);

// POST new question for exam
r.post("/exam/:examId", authMiddleware, addQuestion);

// GET questions for exam by route param
r.get("/exam/:examId", authMiddleware, getQuestionsForExam);

// GET single question
r.get("/:questionId", authMiddleware, getQuestionById);

// PUT update question
r.put("/:questionId", authMiddleware, updateQuestion);

// DELETE question
r.delete("/:questionId", authMiddleware, deleteQuestion);

export default r;
