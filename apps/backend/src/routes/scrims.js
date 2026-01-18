import { Router } from "express";
import {
  getScrims,
  getScrimById,
  getScrimsByTeamHandler,
  getScrimsByStatusHandler,
  createScrimHandler,
  updateScrimHandler,
  deleteScrimHandler,
} from "../controllers/scrims.controller.js";

const router = Router();

router.get("/", getScrims);
router.get("/team/:teamId", getScrimsByTeamHandler);
router.get("/status/:status", getScrimsByStatusHandler);
router.get("/:id", getScrimById);
router.post("/", createScrimHandler);
router.put("/:id", updateScrimHandler);
router.delete("/:id", deleteScrimHandler);

export default router;
