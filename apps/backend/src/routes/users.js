import { Router } from "express";
import {
  getUsers,
  getUserById,
  getUserByUsernameHandler,
  getUserByEmailHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
  updatePasswordHandler,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);

router.get("/:id", getUserById);

router.get("/username/:username", getUserByUsernameHandler);

router.get("/email/:email", getUserByEmailHandler);

router.post("/", createUserHandler);

router.put("/:id", updateUserHandler);

router.put("/:id/password", updatePasswordHandler);

router.delete("/:id", deleteUserHandler);

export default router;