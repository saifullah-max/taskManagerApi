import express from "express";
import { signupController } from "../controllers/user.signupController";
import { loginController } from "../controllers/user.loginController";
import { refreshTOkenController } from "../controllers/user.refreshTokenController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { logoutController } from "../controllers/user.logoutController";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/auth/refresh", refreshTOkenController);
router.post("/auth/logout", authMiddleware, logoutController);

export default router;
