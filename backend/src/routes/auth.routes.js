import { Router } from "express";
import {
    check,
    login,
    logout,
    register,
    update,
    updateAvatar,
    deleteAccount,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, check);
router.put("/me", authMiddleware, update);
router.delete("/me", authMiddleware, deleteAccount);

router.put("/avatar", authMiddleware, upload.single("avatar"), updateAvatar);

export default router;
