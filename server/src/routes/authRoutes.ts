import { Router } from "express";
import { register, login } from "../controllers/authController";

const router = Router();

// 当有人访问 POST /register 时，执行 register 函数
router.post("/register", register);
router.post("/login", login);

export default router;
