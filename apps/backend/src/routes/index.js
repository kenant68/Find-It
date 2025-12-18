import { Router } from "express";
import usersRouter from "./users.js";
import teamsRouter from "./teams.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Find-It API" });
});

router.use("/users", usersRouter);
router.use("/teams", teamsRouter);

export default router;