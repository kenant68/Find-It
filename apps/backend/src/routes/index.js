import { Router } from "express";
import usersRouter from "./users.js";
import teamsRouter from "./teams.js";
import scrimsRouter from "./scrims.js";
import matchesRouter from "./matches.js";
import mapsRouter from "./maps.js";
import faceitRouter, { usersRouter as faceitUsersRouter } from "./faceit.js";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Find-It API" });
});

router.use("/users", faceitUsersRouter);
router.use("/users", usersRouter);
router.use("/teams", teamsRouter);
router.use("/scrims", scrimsRouter);
router.use("/matches", matchesRouter);
router.use("/maps", mapsRouter);
router.use("/faceit-stats", faceitRouter);

export default router;