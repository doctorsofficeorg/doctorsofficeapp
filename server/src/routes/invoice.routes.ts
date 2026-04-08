import { Router } from "express";
import { authMiddleware, requirePermission } from "../middleware/auth.js";
import {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} from "../controllers/invoice.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", requirePermission("invoices:write"), createInvoice);
router.get("/", requirePermission("invoices:read"), getInvoices);
router.get("/:id", requirePermission("invoices:read"), getInvoiceById);
router.put("/:id", requirePermission("invoices:write"), updateInvoice);
router.delete("/:id", requirePermission("invoices:delete"), deleteInvoice);

export default router;
