import { Router } from "express";
import { getMatches, getMatchById, getMatchesByTeamHandler, createMatchHandler } from "../controllers/matches.controller.js";

const router = Router();

router.get("/", getMatches);
router.get("/team/:teamName", getMatchesByTeamHandler);
router.get("/:id", getMatchById);
router.post("/", createMatchHandler);

export default router;
