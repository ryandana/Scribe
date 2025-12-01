import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getStudentsByClass } from "../controllers/student.controller.js";

const router = express.Router();

router.get("/class/:classId", authMiddleware, getStudentsByClass);

export default router;
