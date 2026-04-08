import { Request, Response } from "express";
import { Clinic } from "../models/clinic.model.js";
import { ClinicMembership, DEFAULT_PERMISSIONS } from "../models/clinic-membership.model.js";

/**
 * Create a new clinic. The authenticated user becomes the owner.
 */
export async function createClinicHandler(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { name, address, city, state, pincode, phone, email, gstin, region, branding } = req.body;

    if (!name || !address || !city || !state || !pincode || !phone || !email) {
      res.status(400).json({ error: "Name, address, city, state, pincode, phone, and email are required" });
      return;
    }

    const clinic = await Clinic.create({
      name,
      address,
      city,
      state,
      pincode,
      phone,
      email,
      gstin,
      region: region || "india",
      branding: branding || {},
      ownerId: req.user.userId,
    });

    // Create owner membership
    await ClinicMembership.create({
      userId: req.user.userId,
      clinicId: clinic._id,
      role: "owner",
      permissions: DEFAULT_PERMISSIONS.owner,
    });

    res.status(201).json({ clinic });
  } catch (error) {
    console.error("[Clinic] create error:", error);
    res.status(500).json({ error: "Failed to create clinic" });
  }
}

/**
 * Update clinic details (name, address, branding, etc.).
 */
export async function updateClinicHandler(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.params.id || req.membership?.clinicId;

    if (!clinicId) {
      res.status(400).json({ error: "Clinic ID is required" });
      return;
    }

    const updates = req.body;
    delete updates._id;
    delete updates.ownerId;

    const clinic = await Clinic.findByIdAndUpdate(clinicId, updates, { new: true });

    if (!clinic) {
      res.status(404).json({ error: "Clinic not found" });
      return;
    }

    res.status(200).json({ clinic });
  } catch (error) {
    console.error("[Clinic] update error:", error);
    res.status(500).json({ error: "Failed to update clinic" });
  }
}

/**
 * Get clinic details including branding.
 */
export async function getClinicHandler(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.params.id || req.membership?.clinicId;

    const clinic = await Clinic.findById(clinicId);

    if (!clinic) {
      res.status(404).json({ error: "Clinic not found" });
      return;
    }

    res.status(200).json({ clinic });
  } catch (error) {
    console.error("[Clinic] get error:", error);
    res.status(500).json({ error: "Failed to fetch clinic" });
  }
}

/**
 * Get all clinics the authenticated user is a member of.
 */
export async function getMyClinicsHandler(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const memberships = await ClinicMembership.find({
      userId: req.user.userId,
      isActive: true,
    }).populate("clinicId").lean();

    const clinics = memberships.map((m: any) => ({
      clinicId: m.clinicId._id.toString(),
      name: m.clinicId.name,
      city: m.clinicId.city,
      role: m.role,
      branding: m.clinicId.branding,
    }));

    res.status(200).json({ clinics });
  } catch (error) {
    console.error("[Clinic] getMyClinics error:", error);
    res.status(500).json({ error: "Failed to fetch clinics" });
  }
}

/**
 * Update clinic branding (logo, colors, theme).
 */
export async function updateBrandingHandler(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.params.id || req.membership?.clinicId;
    const branding = req.body;

    const clinic = await Clinic.findByIdAndUpdate(
      clinicId,
      { branding },
      { new: true }
    );

    if (!clinic) {
      res.status(404).json({ error: "Clinic not found" });
      return;
    }

    res.status(200).json({ branding: clinic.branding });
  } catch (error) {
    console.error("[Clinic] updateBranding error:", error);
    res.status(500).json({ error: "Failed to update branding" });
  }
}
