import { getAllTeams, getTeam, createTeam } from "../services/teams.service.js";

export function getTeams(req, res) {
  const teams = getAllTeams();
  res.json(teams);
}

export function getTeamById(req, res) {
  const id = Number(req.params.id);
  const team = getTeam(id);

  if (!team) {
    return res
      .status(404)
      .json({ error: { message: "Team not found", code: "TEAM_NOT_FOUND" } });
  }

  res.json(team);
}

export function createTeamHandler(req, res) {
  try {
    const newTeam = createTeam(req.body);
    res.status(201).json(newTeam);
  } catch (err) {
    if (err.message === "INVALID_PAYLOAD") {
      return res
        .status(400)
        .json({ error: { message: "Missing or invalid fields", code: "INVALID_PAYLOAD" } });
    }

    if (err.message === "INVALID_ELO") {
      return res
        .status(400)
        .json({ error: { message: "Invalid elo value", code: "INVALID_ELO" } });
    }

    if (err.message === "TEAM_NAME_ALREADY_EXISTS") {
      return res
        .status(409)
        .json({ error: { message: "Team name already exists", code: "TEAM_NAME_ALREADY_EXISTS" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}