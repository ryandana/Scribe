import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    getStudentsByClass,
} from "../controllers/class.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createClass);
router.get("/", authMiddleware, getAllClasses);
router.get("/:id", authMiddleware, getClassById);
router.put("/:id", authMiddleware, updateClass);
router.delete("/:id", authMiddleware, deleteClass);

router.get("/:id/students", authMiddleware, getStudentsByClass);

export default router;
