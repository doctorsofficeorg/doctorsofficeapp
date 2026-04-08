import { Router } from "express";
import { authMiddleware, requirePermission } from "../middleware/auth.js";
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescription.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", requirePermission("prescriptions:write"), createPrescription);
router.get("/", requirePermission("prescriptions:read"), getPrescriptions);
router.get("/:id", requirePermission("prescriptions:read"), getPrescriptionById);
router.put("/:id", requirePermission("prescriptions:write"), updatePrescription);
router.delete("/:id", requirePermission("prescriptions:delete"), deletePrescription);

export default router;
