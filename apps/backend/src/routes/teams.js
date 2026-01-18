import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getTeams,
  getTeamById,
  getTeamByIdWithMembersHandler,
  getTeamByNameHandler,
  createTeamHandler,
  updateTeamHandler,
  deleteTeamHandler,
  addTeamMemberHandler,
  removeTeamMemberHandler,
  leaveTeamHandler,
} from "../controllers/teams.controller.js";
import { getScrimsByTeamHandler } from "../controllers/scrims.controller.js";

const router = Router();

router.get("/", getTeams);
router.get("/name/:name", getTeamByNameHandler);
router.get("/:id/scrims", getScrimsByTeamHandler);
router.get("/:id/members", getTeamByIdWithMembersHandler);
router.get("/:id", getTeamById);
router.post("/", authMiddleware, createTeamHandler);
router.put("/:id", authMiddleware, updateTeamHandler);
router.delete("/:id", authMiddleware, deleteTeamHandler);

router.post("/:id/members", authMiddleware, addTeamMemberHandler);
router.delete("/:id/members/:userId", authMiddleware, removeTeamMemberHandler);
router.post("/leave", authMiddleware, leaveTeamHandler);

export default router;