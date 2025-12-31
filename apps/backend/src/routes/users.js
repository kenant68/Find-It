import { Router } from "express";
import { getUsers, getUserById, createUserHandler } from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUserHandler);

export default router;