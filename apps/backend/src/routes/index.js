import { Router } from "express";
import usersRouter from "./users.js";
import teamsRouter from "./teams.js";
import scrimsRouter from "./scrims.js";
import mapsRouter from "./maps.js";
import faceitRouter, { usersRouter as faceitUsersRouter } from "./faceit.js";
import faceitMatchsRouter from "./faceit-matchs.js";
import authRouter from "./auth.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Find-It API" });
});

router.use("/users", faceitUsersRouter);
router.use("/users", usersRouter);
router.use("/teams", teamsRouter);
router.use("/scrims", scrimsRouter);
router.use("/maps", mapsRouter);
router.use("/faceit-stats", faceitRouter);
router.use("/faceit-matches", faceitMatchsRouter);
router.use("/auth", authRouter);

export default router;