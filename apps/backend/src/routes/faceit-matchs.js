import { Router } from "express";
import {
  getFaceitStatsHandler,
  getRecentMatchesHandler,
} from "../controllers/faceit-matchs.controller.js";

const router = Router();

router.get("/:userId", getFaceitStatsHandler);

router.get("/:userId/recent-matches", getRecentMatchesHandler);

export default router;