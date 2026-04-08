import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { ClinicMembership, ClinicRole, DEFAULT_PERMISSIONS, CLINIC_ROLES } from "../models/clinic-membership.model.js";

/**
 * Get all members of the current clinic.
 */
export async function getMembersHandler(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership?.clinicId;

    if (!clinicId) {
      res.status(400).json({ error: "No clinic selected" });
      return;
    }

    const memberships = await ClinicMembership.find({ clinicId, isActive: true })
      .populate("userId", "fullName phone email avatarUrl")
      .populate("invitedBy", "fullName")
      .lean();

    const members = memberships.map((m: any) => ({
      id: m._id,
      userId: m.userId._id,
      fullName: m.userId.fullName,
      phone: m.userId.phone,
      email: m.userId.email,
      avatarUrl: m.userId.avatarUrl,
      role: m.role,
      permissions: m.permissions,
      qualification: m.qualification,
      specialization: m.specialization,
      registrationNumber: m.registrationNumber,
      invitedBy: m.invitedBy?.fullName,
      joinedAt: m.joinedAt,
      isActive: m.isActive,
    }));

    res.status(200).json({ members });
  } catch (error) {
    console.error("[Members] getMembers error:", error);
    res.status(500).json({ error: "Failed to fetch members" });
  }
}

/**
 * Invite a user to the clinic by phone number.
 * If the user doesn't exist yet, create a placeholder account.
 */
export async function inviteMemberHandler(req: Request, res: Response): Promise<void> {
  try {
    const clinicId = req.membership?.clinicId;

    if (!clinicId || !req.user) {
      res.status(400).json({ error: "No clinic selected" });
      return;
    }

    const { phone, role, qualification, specialization, registrationNumber } = req.body;

    if (!phone || !role) {
      res.status(400).json({ error: "Phone and role are required" });
      return;
    }

    if (!CLINIC_ROLES.includes(role)) {
      res.status(400).json({ error: `Invalid role. Must be one of: ${CLINIC_ROLES.join(", ")}` });
      return;
    }

    if (role === "owner") {
      res.status(400).json({ error: "Cannot invite as owner. Transfer ownership instead." });
      return;
    }

    // Find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone, fullName: "Invited User" });
    }

    // Check if already a member
    const existing = await ClinicMembership.findOne({ userId: user._id, clinicId });

    if (existing) {
      if (existing.isActive) {
        res.status(409).json({ error: "User is already a member of this clinic" });
        return;
      }
      // Re-activate
      existing.isActive = true;
      existing.role = role as ClinicRole;
      existing.permissions = DEFAULT_PERMISSIONS[role as ClinicRole];
      existing.invitedBy = req.user.userId as any;
      if (qualification) existing.qualification = qualification;
      if (specialization) existing.specialization = specialization;
      if (registrationNumber) existing.registrationNumber = registrationNumber;
      await existing.save();

      res.status(200).json({ message: "Member re-activated", membership: existing });
      return;
    }

    const membership = await ClinicMembership.create({
      userId: user._id,
      clinicId,
      role: role as ClinicRole,
      permissions: DEFAULT_PERMISSIONS[role as ClinicRole],
      qualification,
      specialization,
      registrationNumber,
      invitedBy: req.user.userId,
    });

    res.status(201).json({ message: "Member invited", membership });
  } catch (error) {
    console.error("[Members] invite error:", error);
    res.status(500).json({ error: "Failed to invite member" });
  }
}

/**
 * Update a member's role or permissions.
 */
export async function updateMemberHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { role, permissions, qualification, specialization, registrationNumber } = req.body;

    const membership = await ClinicMembership.findById(id);

    if (!membership) {
      res.status(404).json({ error: "Membership not found" });
      return;
    }

    // Cannot change an owner's role
    if (membership.role === "owner" && role && role !== "owner") {
      res.status(400).json({ error: "Cannot change owner role. Transfer ownership first." });
      return;
    }

    if (role && CLINIC_ROLES.includes(role)) {
      membership.role = role as ClinicRole;
      // Reset to default permissions for new role unless custom permissions provided
      if (!permissions) {
        membership.permissions = DEFAULT_PERMISSIONS[role as ClinicRole];
      }
    }

    if (permissions && Array.isArray(permissions)) {
      membership.permissions = permissions;
    }

    if (qualification !== undefined) membership.qualification = qualification;
    if (specialization !== undefined) membership.specialization = specialization;
    if (registrationNumber !== undefined) membership.registrationNumber = registrationNumber;

    await membership.save();

    res.status(200).json({ membership });
  } catch (error) {
    console.error("[Members] update error:", error);
    res.status(500).json({ error: "Failed to update member" });
  }
}

/**
 * Remove (deactivate) a member from the clinic.
 */
export async function removeMemberHandler(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const membership = await ClinicMembership.findById(id);

    if (!membership) {
      res.status(404).json({ error: "Membership not found" });
      return;
    }

    if (membership.role === "owner") {
      res.status(400).json({ error: "Cannot remove the clinic owner" });
      return;
    }

    membership.isActive = false;
    await membership.save();

    res.status(200).json({ message: "Member removed" });
  } catch (error) {
    console.error("[Members] remove error:", error);
    res.status(500).json({ error: "Failed to remove member" });
  }
}

/**
 * Get available roles and their default permissions (for UI).
 */
export async function getRolesHandler(_req: Request, res: Response): Promise<void> {
  res.status(200).json({
    roles: CLINIC_ROLES.map((role) => ({
      role,
      label: role.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      defaultPermissions: DEFAULT_PERMISSIONS[role],
    })),
  });
}
