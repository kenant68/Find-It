import { Router } from "express";
import {
  getTeams,
  getTeamById,
  getTeamByIdWithMembersHandler,
  getTeamByNameHandler,
  createTeamHandler,
  updateTeamHandler,
  deleteTeamHandler,
} from "../controllers/teams.controller.js";
import { getScrimsByTeamHandler } from "../controllers/scrims.controller.js";

const router = Router();

router.get("/", getTeams);
router.get("/name/:name", getTeamByNameHandler);
router.get("/:id/scrims", getScrimsByTeamHandler);
router.get("/:id/members", getTeamByIdWithMembersHandler);
router.get("/:id", getTeamById);
router.post("/", createTeamHandler);
router.put("/:id", updateTeamHandler);
router.delete("/:id", deleteTeamHandler);

export default router;