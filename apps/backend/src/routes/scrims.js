import { Router } from "express";
import { getScrims, getScrimById, createScrimHandler } from "../controllers/scrims.controller.js";

const router = Router();

router.get("/", getScrims);
router.get("/:id", getScrimById);
router.post("/", createScrimHandler);

export default router;
