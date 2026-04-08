import { Router } from "express";
import { authMiddleware, requirePermission } from "../middleware/auth.js";
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patient.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", requirePermission("patients:write"), createPatient);
router.get("/", requirePermission("patients:read"), getPatients);
router.get("/:id", requirePermission("patients:read"), getPatientById);
router.put("/:id", requirePermission("patients:write"), updatePatient);
router.delete("/:id", requirePermission("patients:delete"), deletePatient);

export default router;
