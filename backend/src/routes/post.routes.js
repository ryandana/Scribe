import { Router } from "express";
import {
    createPost,
    deletePost,
    getAllPosts,
    getSinglePost,
    updatePost,
} from "../controllers/post.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllPosts);
router.get("/:id", getSinglePost);

router.post("/", authMiddleware, createPost);

router.put("/:id", authMiddleware, updatePost);

router.delete("/:id", authMiddleware, deletePost);

export default router;
