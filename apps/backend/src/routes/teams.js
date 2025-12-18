import { Router } from "express";
import { getTeams, getTeamById, createTeamHandler } from "../teams/teams.controller.js";

const router = Router();

router.get("/", getTeams);
router.get("/:id", getTeamById);
router.post("/", createTeamHandler);

export default router;