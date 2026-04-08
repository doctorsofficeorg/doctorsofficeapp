import { Request, Response } from "express";
import { Invoice } from "../models/invoice.model.js";

export async function createInvoice(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const invoice = await Invoice.create({ ...req.body, clinicId });
    res.status(201).json(invoice);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({ error: "Invoice with this number already exists" });
      return;
    }
    console.error("[Invoice] create error:", error);
    res.status(500).json({ error: "Failed to create invoice" });
  }
}

export async function getInvoices(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const { patientId, paymentStatus, page = "1", limit = "20" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = { clinicId };

    if (patientId) {
      filter.patientId = patientId;
    }

    if (paymentStatus) {
      filter.paymentStatus = paymentStatus;
    }

    const [invoices, total] = await Promise.all([
      Invoice.find(filter)
        .populate("patientId", "fullName phone patientUid")
        .populate("appointmentId", "appointmentDate tokenNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Invoice.countDocuments(filter),
    ]);

    res.status(200).json({
      data: invoices,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("[Invoice] getAll error:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
}

export async function getInvoiceById(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const invoice = await Invoice.findOne({ _id: req.params.id, clinicId })
      .populate("patientId", "fullName phone patientUid address")
      .populate("appointmentId", "appointmentDate tokenNumber");

    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error("[Invoice] getById error:", error);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
}

export async function updateInvoice(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, clinicId },
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("patientId", "fullName phone patientUid")
      .populate("appointmentId", "appointmentDate tokenNumber");

    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    res.status(200).json(invoice);
  } catch (error) {
    console.error("[Invoice] update error:", error);
    res.status(500).json({ error: "Failed to update invoice" });
  }
}

export async function deleteInvoice(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, clinicId });

    if (!invoice) {
      res.status(404).json({ error: "Invoice not found" });
      return;
    }

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("[Invoice] delete error:", error);
    res.status(500).json({ error: "Failed to delete invoice" });
  }
}
