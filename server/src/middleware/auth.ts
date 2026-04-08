import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../services/token.service.js";
import { ClinicMembership, ClinicRole } from "../models/clinic-membership.model.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      /** Active clinic membership for the current request */
      membership?: {
        clinicId: string;
        role: ClinicRole;
        permissions: string[];
      };
    }
  }
}

/**
 * Validates JWT and attaches user info to request.
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}

/**
 * Middleware factory that checks if the user has a specific permission
 * on the clinic specified by the `x-clinic-id` header.
 */
export function requirePermission(...requiredPermissions: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const clinicId = req.headers["x-clinic-id"] as string || req.user.clinicId;

    if (!clinicId) {
      res.status(400).json({ error: "No clinic selected. Set x-clinic-id header." });
      return;
    }

    const membership = await ClinicMembership.findOne({
      userId: req.user.userId,
      clinicId,
      isActive: true,
    });

    if (!membership) {
      res.status(403).json({ error: "You are not a member of this clinic." });
      return;
    }

    // Owners bypass permission checks
    if (membership.role === "owner") {
      req.membership = {
        clinicId,
        role: membership.role,
        permissions: membership.permissions,
      };
      next();
      return;
    }

    const hasPermission = requiredPermissions.every((perm) =>
      membership.permissions.includes(perm)
    );

    if (!hasPermission) {
      res.status(403).json({ error: "Insufficient permissions." });
      return;
    }

    req.membership = {
      clinicId,
      role: membership.role,
      permissions: membership.permissions,
    };

    next();
  };
}
