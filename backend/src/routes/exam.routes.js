import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createExam, getExamsByClass } from "../controllers/exam.controller.js";

const router = express.Router();
router.post("/", authMiddleware, createExam);
router.get("/class/:classId", authMiddleware, getExamsByClass);

export default router;
