import { Request, Response } from "express";
import { Prescription } from "../models/prescription.model.js";

export async function createPrescription(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const doctorId = req.user!.userId;

    const prescription = await Prescription.create({
      ...req.body,
      clinicId,
      doctorId,
    });

    res.status(201).json(prescription);
  } catch (error) {
    console.error("[Prescription] create error:", error);
    res.status(500).json({ error: "Failed to create prescription" });
  }
}

export async function getPrescriptions(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const { patientId, appointmentId, page = "1", limit = "20" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = { clinicId };

    if (patientId) {
      filter.patientId = patientId;
    }

    if (appointmentId) {
      filter.appointmentId = appointmentId;
    }

    const [prescriptions, total] = await Promise.all([
      Prescription.find(filter)
        .populate("patientId", "fullName phone patientUid")
        .populate("doctorId", "fullName specialization qualification")
        .populate("appointmentId", "appointmentDate tokenNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Prescription.countDocuments(filter),
    ]);

    res.status(200).json({
      data: prescriptions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("[Prescription] getAll error:", error);
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
}

export async function getPrescriptionById(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const prescription = await Prescription.findOne({ _id: req.params.id, clinicId })
      .populate("patientId", "fullName phone patientUid age gender bloodGroup allergies")
      .populate("doctorId", "fullName specialization qualification registrationNumber signatureUrl")
      .populate("appointmentId", "appointmentDate tokenNumber chiefComplaint vitals");

    if (!prescription) {
      res.status(404).json({ error: "Prescription not found" });
      return;
    }

    res.status(200).json(prescription);
  } catch (error) {
    console.error("[Prescription] getById error:", error);
    res.status(500).json({ error: "Failed to fetch prescription" });
  }
}

export async function updatePrescription(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.id, clinicId },
      { $set: req.body },
      { new: true, runValidators: true }
    )
      .populate("patientId", "fullName phone patientUid")
      .populate("doctorId", "fullName specialization");

    if (!prescription) {
      res.status(404).json({ error: "Prescription not found" });
      return;
    }

    res.status(200).json(prescription);
  } catch (error) {
    console.error("[Prescription] update error:", error);
    res.status(500).json({ error: "Failed to update prescription" });
  }
}

export async function deletePrescription(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const prescription = await Prescription.findOneAndDelete({ _id: req.params.id, clinicId });

    if (!prescription) {
      res.status(404).json({ error: "Prescription not found" });
      return;
    }

    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (error) {
    console.error("[Prescription] delete error:", error);
    res.status(500).json({ error: "Failed to delete prescription" });
  }
}
