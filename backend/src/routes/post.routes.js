import { Router } from "express";
import {
    createPost,
    deletePost,
    getAllPosts,
    getSinglePost,
    updatePost,
} from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getSinglePost);

router.post("/", authMiddleware, upload.single("thumbnail_url"), createPost);

router.put("/:id", authMiddleware, upload.single("thumbnail_url"), updatePost);

router.delete("/:id", authMiddleware, deletePost);

export default router;
