import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    createExam,
    getExamsByClass,
    getExamById,
    updateExam,
    deleteExam,
} from "../controllers/exam.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createExam);
router.get("/class/:classId", authMiddleware, getExamsByClass);
router.get("/:examId", authMiddleware, getExamById);
router.put("/:examId", authMiddleware, updateExam);
router.delete("/:examId", authMiddleware, deleteExam);

export default router;
