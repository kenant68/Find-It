import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getTeams,
  getTeamById,
  getTeamByIdWithMembersHandler,
  getTeamByNameHandler,
  createTeamHandler,
  claimTeamHandler,
  getUserTeamHandler,
  joinTeamHandler,
  updateTeamHandler,
  deleteTeamHandler,
  addTeamMemberHandler,
  removeTeamMemberHandler,
  leaveTeamHandler,
} from "../controllers/teams.controller.js";
import { getScrimsByTeamHandler } from "../controllers/scrims.controller.js";

const router = Router();

router.get("/", getTeams);
router.get("/my-team", authMiddleware, getUserTeamHandler);
router.get("/name/:name", getTeamByNameHandler);
router.get("/:id/scrims", getScrimsByTeamHandler);
router.get("/:id/members", getTeamByIdWithMembersHandler);
router.get("/:id", getTeamById);
router.post("/", authMiddleware, createTeamHandler);
router.post("/:id/claim", authMiddleware, claimTeamHandler);
router.post("/:id/join", authMiddleware, joinTeamHandler);
router.put("/:id", authMiddleware, updateTeamHandler);
router.delete("/:id", authMiddleware, deleteTeamHandler);

router.post("/:id/members", authMiddleware, addTeamMemberHandler);
router.delete("/:id/members/:userId", authMiddleware, removeTeamMemberHandler);
router.post("/leave", authMiddleware, leaveTeamHandler);

export default router;