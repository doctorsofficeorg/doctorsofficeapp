import { Router } from "express";
import { authMiddleware, requirePermission } from "../middleware/auth.js";
import {
  getMembersHandler,
  inviteMemberHandler,
  updateMemberHandler,
  removeMemberHandler,
  getRolesHandler,
} from "../controllers/member.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/roles", getRolesHandler);
router.get("/", requirePermission("members:manage"), getMembersHandler);
router.post("/invite", requirePermission("members:invite"), inviteMemberHandler);
router.put("/:id", requirePermission("members:manage"), updateMemberHandler);
router.delete("/:id", requirePermission("members:remove"), removeMemberHandler);

export default router;
