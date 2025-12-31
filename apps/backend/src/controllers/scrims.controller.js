import { getAllScrims, getScrim, getScrimsByTeam, createScrim } from "../services/scrims.service.js";

export function getScrims(req, res) {
  const scrims = getAllScrims();
  res.json(scrims);
}

export function getScrimById(req, res) {
  const id = Number(req.params.id);
  const scrim = getScrim(id);

  if (!scrim) {
    return res
      .status(404)
      .json({ error: { message: "Scrim not found", code: "SCRIM_NOT_FOUND" } });
  }

  res.json(scrim);
}

export function getScrimsByTeamHandler(req, res) {
  const teamId = Number(req.params.id);
  const scrims = getScrimsByTeam(teamId);
  res.json(scrims);
}

export function createScrimHandler(req, res) {
  try {
    const newScrim = createScrim(req.body);
    res.status(201).json(newScrim);
  } catch (err) {
    if (err.message === "INVALID_PAYLOAD") {
      return res
        .status(400)
        .json({ error: { message: "Missing or invalid fields", code: "INVALID_PAYLOAD" } });
    }

    if (err.message === "INVALID_TEAM_A") {
      return res
        .status(400)
        .json({ error: { message: "Invalid team A ID", code: "INVALID_TEAM_A" } });
    }

    if (err.message === "INVALID_TEAM_B") {
      return res
        .status(400)
        .json({ error: { message: "Invalid team B ID", code: "INVALID_TEAM_B" } });
    }

    if (err.message === "TEAMS_MUST_BE_DIFFERENT") {
      return res
        .status(400)
        .json({ error: { message: "Team A and Team B must be different", code: "TEAMS_MUST_BE_DIFFERENT" } });
    }

    if (err.message === "INVALID_MAP_ID") {
      return res
        .status(400)
        .json({ error: { message: "Invalid map ID", code: "INVALID_MAP_ID" } });
    }

    if (err.message === "INVALID_HORAIRE") {
      return res
        .status(400)
        .json({ error: { message: "Invalid horaire format. Expected HH:MM", code: "INVALID_HORAIRE" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}
