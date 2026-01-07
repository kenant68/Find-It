import { Router } from "express";
import { getFaceitStatsHandler, getFaceitStatsByIdHandler, getUserFaceitStatsHandler } from "../controllers/faceit.controller.js";

const router = Router();

router.get("/", getFaceitStatsHandler);
router.get("/:id", getFaceitStatsByIdHandler);

const usersRouter = Router();
usersRouter.get("/:id/faceit-stats", getUserFaceitStatsHandler);

export default router;
export { usersRouter };
