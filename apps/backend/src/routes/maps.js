import { Router } from "express";
import {
  getMaps,
  getMapById,
  getMapByTitleHandler,
  createMapHandler,
  updateMapHandler,
  deleteMapHandler,
} from "../controllers/maps.controller.js";

const router = Router();

router.get("/", getMaps);
router.get("/title/:title", getMapByTitleHandler);
router.get("/:id", getMapById);
router.post("/", createMapHandler);
router.put("/:id", updateMapHandler);
router.delete("/:id", deleteMapHandler);

export default router;
