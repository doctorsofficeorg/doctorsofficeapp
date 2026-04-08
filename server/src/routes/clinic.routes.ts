import { Router } from "express";
import { authMiddleware, requirePermission } from "../middleware/auth.js";
import {
  createClinicHandler,
  updateClinicHandler,
  getClinicHandler,
  getMyClinicsHandler,
  updateBrandingHandler,
} from "../controllers/clinic.controller.js";

const router = Router();

// All routes require auth
router.use(authMiddleware);

// User's clinics (no specific clinic context needed)
router.get("/my-clinics", getMyClinicsHandler);
router.post("/", createClinicHandler);

// Clinic-specific routes (require clinic context + permissions)
router.get("/:id", requirePermission(), getClinicHandler);
router.put("/:id", requirePermission("settings:manage"), updateClinicHandler);
router.put("/:id/branding", requirePermission("settings:manage"), updateBrandingHandler);

export default router;
