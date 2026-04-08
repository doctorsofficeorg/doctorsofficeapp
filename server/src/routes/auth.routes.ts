import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  sendOtpHandler,
  verifyOtpHandler,
  refreshTokenHandler,
  switchClinicHandler,
  getMeHandler,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Rate limit auth routes: 10 requests per minute per IP
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again after a minute" },
});

router.post("/send-otp", authLimiter, sendOtpHandler);
router.post("/verify-otp", authLimiter, verifyOtpHandler);
router.post("/refresh", refreshTokenHandler);

// Authenticated routes
router.get("/me", authMiddleware, getMeHandler);
router.post("/switch-clinic", authMiddleware, switchClinicHandler);

export default router;
