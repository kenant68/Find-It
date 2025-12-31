import { Router } from "express";
import { getMaps, getMapById, createMapHandler } from "../controllers/maps.controller.js";

const router = Router();

router.get("/", getMaps);
router.get("/:id", getMapById);
router.post("/", createMapHandler);

export default router;
