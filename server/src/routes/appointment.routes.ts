import { Router } from "express";
import { authMiddleware, requirePermission } from "../middleware/auth.js";
import {
  createAppointment,
  getAppointments,
  getTodayQueue,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointment.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/today-queue", requirePermission("appointments:read"), getTodayQueue);

router.post("/", requirePermission("appointments:write"), createAppointment);
router.get("/", requirePermission("appointments:read"), getAppointments);
router.get("/:id", requirePermission("appointments:read"), getAppointmentById);
router.put("/:id", requirePermission("appointments:write"), updateAppointment);
router.delete("/:id", requirePermission("appointments:delete"), deleteAppointment);

export default router;
