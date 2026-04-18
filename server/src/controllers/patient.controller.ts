import { Request, Response } from "express";
import { Patient } from "../models/patient.model.js";

export async function createPatient(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const patient = await Patient.create({ ...req.body, clinicId });
    res.status(201).json(patient);
  } catch (error: any) {
    if (error.code === 11000) {
      console.error("[Patient] duplicate key:", {
        keyPattern: error.keyPattern,
        keyValue: error.keyValue,
        message: error.message,
      });
      const field = Object.keys(error.keyPattern ?? {})[0] ?? "unknown field";
      res.status(409).json({ error: `Duplicate ${field}` });
      return;
    }
    console.error("[Patient] create error:", error);
    res.status(500).json({ error: "Failed to create patient" });
  }
}

export async function getPatients(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const { search, page = "1", limit = "20" } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, unknown> = { clinicId };
    if (search && typeof search === "string") {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { patientUid: { $regex: search, $options: "i" } },
      ];
    }

    const [patients, total] = await Promise.all([
      Patient.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Patient.countDocuments(filter),
    ]);

    res.status(200).json({
      data: patients,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("[Patient] getAll error:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
}

export async function getPatientById(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const patient = await Patient.findOne({ _id: req.params.id, clinicId });

    if (!patient) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("[Patient] getById error:", error);
    res.status(500).json({ error: "Failed to fetch patient" });
  }
}

export async function updatePatient(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, clinicId },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!patient) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error("[Patient] update error:", error);
    res.status(500).json({ error: "Failed to update patient" });
  }
}

export async function deletePatient(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership!.clinicId;
    const patient = await Patient.findOneAndDelete({ _id: req.params.id, clinicId });

    if (!patient) {
      res.status(404).json({ error: "Patient not found" });
      return;
    }

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("[Patient] delete error:", error);
    res.status(500).json({ error: "Failed to delete patient" });
  }
}
