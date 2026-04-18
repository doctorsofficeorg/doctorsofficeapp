import { Request, Response } from "express";
import { sendOtp, verifyOtp } from "../services/otp.service.js";
import { signAccessToken, signRefreshToken, verifyToken } from "../services/token.service.js";
import { User } from "../models/user.model.js";
import { ClinicMembership } from "../models/clinic-membership.model.js";

export async function sendOtpHandler(req: Request, res: Response): Promise<void> {
  try {
    const { phone } = req.body;

    if (!phone || typeof phone !== "string") {
      res.status(400).json({ error: "Phone number is required" });
      return;
    }

    if (!/^\+91\d{10}$/.test(phone)) {
      res.status(400).json({ error: "Invalid phone number. Expected format: +91XXXXXXXXXX" });
      return;
    }

    const result = await sendOtp(phone);
    res.status(200).json(result);
  } catch (error) {
    console.error("[Auth] sendOtp error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
}

export async function verifyOtpHandler(req: Request, res: Response): Promise<void> {
  try {
    const { phone, otp, fullName } = req.body;

    if (!phone || !otp) {
      res.status(400).json({ error: "Phone and OTP are required" });
      return;
    }

    const isValid = await verifyOtp(phone, otp);

    if (!isValid) {
      res.status(401).json({ error: "Invalid or expired OTP" });
      return;
    }

    // Find or create user
    let user = await User.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = await User.create({
        phone,
        fullName: fullName?.trim() || "Doctor",
      });
    } else if (fullName?.trim()) {
      // Update name if provided (e.g. user was invited but now sets their name)
      user.fullName = fullName.trim();
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Get user's clinic memberships. Do NOT auto-create a placeholder clinic
    // here — the frontend onboarding flow guides the user through explicit
    // clinic creation (or selection among existing memberships).
    const memberships = await ClinicMembership.find({ userId: user._id, isActive: true })
      .populate("clinicId")
      .lean();

    // If the user is a member of at least one clinic, scope tokens to the
    // first one; otherwise the access token has no clinicId and the frontend
    // routes the user to the "create clinic" onboarding page.
    const defaultMembership = memberships[0];
    const defaultClinicId = defaultMembership
      ? ((defaultMembership.clinicId as any)._id?.toString() ?? defaultMembership.clinicId.toString())
      : null;

    const tokenPayload = {
      userId: user._id.toString(),
      phone: user.phone,
      clinicId: defaultClinicId ?? "",
      role: defaultMembership?.role ?? "owner",
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    const clinics = memberships.map((m: any) => ({
      clinicId: m.clinicId._id?.toString() || m.clinicId.toString(),
      clinicName: m.clinicId.name || "Clinic",
      role: m.role,
      branding: m.clinicId.branding,
    }));

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      clinics,
      activeClinicId: defaultClinicId,
      isNewUser,
    });
  } catch (error) {
    console.error("[Auth] verifyOtp error:", error);
    res.status(500).json({ error: "OTP verification failed" });
  }
}

export async function refreshTokenHandler(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ error: "Refresh token is required" });
      return;
    }

    const payload = verifyToken(refreshToken);
    const newAccessToken = signAccessToken({
      userId: payload.userId,
      phone: payload.phone,
      clinicId: payload.clinicId,
      role: payload.role,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch {
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
}

/**
 * Switch active clinic — returns new tokens scoped to the selected clinic.
 */
export async function switchClinicHandler(req: Request, res: Response): Promise<void> {
  try {
    const { clinicId } = req.body;

    if (!clinicId || !req.user) {
      res.status(400).json({ error: "clinicId is required" });
      return;
    }

    const membership = await ClinicMembership.findOne({
      userId: req.user.userId,
      clinicId,
      isActive: true,
    }).populate("clinicId");

    if (!membership) {
      res.status(403).json({ error: "You are not a member of this clinic." });
      return;
    }

    const tokenPayload = {
      userId: req.user.userId,
      phone: req.user.phone,
      clinicId: clinicId.toString(),
      role: membership.role,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    const clinic = membership.clinicId as any;

    res.status(200).json({
      accessToken,
      refreshToken,
      clinic: {
        id: clinic._id,
        name: clinic.name,
        branding: clinic.branding,
      },
      role: membership.role,
      permissions: membership.permissions,
    });
  } catch (error) {
    console.error("[Auth] switchClinic error:", error);
    res.status(500).json({ error: "Failed to switch clinic" });
  }
}

/**
 * Update current user's profile.
 */
export async function updateProfileHandler(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const { fullName, email } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (fullName?.trim()) user.fullName = fullName.trim();
    if (email !== undefined) user.email = email?.trim() || undefined;

    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("[Auth] updateProfile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
}

/**
 * Get current user profile with all clinic memberships.
 */
export async function getMeHandler(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await User.findById(req.user.userId).lean();
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const memberships = await ClinicMembership.find({ userId: req.user.userId, isActive: true })
      .populate("clinicId")
      .lean();

    const clinics = memberships.map((m: any) => ({
      clinicId: m.clinicId._id.toString(),
      clinicName: m.clinicId.name,
      role: m.role,
      permissions: m.permissions,
      branding: m.clinicId.branding,
    }));

    res.status(200).json({
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
      clinics,
    });
  } catch (error) {
    console.error("[Auth] getMe error:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}
