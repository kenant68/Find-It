import { Router } from "express";
import usersRouter from "./users.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Find-It API" });
});

router.use("/users", usersRouter);

export default router;