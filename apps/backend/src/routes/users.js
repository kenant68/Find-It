import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
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

router.get("/username/:username", authMiddleware, getUserByUsernameHandler);

router.get("/email/:email", authMiddleware, getUserByEmailHandler);

router.post("/", createUserHandler);

router.put("/:id", authMiddleware, updateUserHandler);

router.put("/:id/password", authMiddleware, updatePasswordHandler);

router.delete("/:id", authMiddleware, deleteUserHandler);

export default router;