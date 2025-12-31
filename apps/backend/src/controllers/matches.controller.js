import { getAllMatches, getMatch, getMatchesByTeam, createMatch } from "../services/matches.service.js";

export function getMatches(req, res) {
  const matches = getAllMatches();
  res.json(matches);
}

export function getMatchById(req, res) {
  const id = Number(req.params.id);
  const match = getMatch(id);

  if (!match) {
    return res
      .status(404)
      .json({ error: { message: "Match not found", code: "MATCH_NOT_FOUND" } });
  }

  res.json(match);
}

export function getMatchesByTeamHandler(req, res) {
  const teamName = req.params.teamName;
  const matches = getMatchesByTeam(teamName);
  res.json(matches);
}

export function createMatchHandler(req, res) {
  try {
    const newMatch = createMatch(req.body);
    res.status(201).json(newMatch);
  } catch (err) {
    if (err.message === "INVALID_PAYLOAD") {
      return res
        .status(400)
        .json({ error: { message: "Missing or invalid fields", code: "INVALID_PAYLOAD" } });
    }

    if (err.message === "TEAMS_MUST_BE_DIFFERENT") {
      return res
        .status(400)
        .json({ error: { message: "Team A and Team B must be different", code: "TEAMS_MUST_BE_DIFFERENT" } });
    }

    if (err.message === "INVALID_SCORE_A") {
      return res
        .status(400)
        .json({ error: { message: "Invalid score A value", code: "INVALID_SCORE_A" } });
    }

    if (err.message === "INVALID_SCORE_B") {
      return res
        .status(400)
        .json({ error: { message: "Invalid score B value", code: "INVALID_SCORE_B" } });
    }

    if (err.message === "INVALID_MAP_ID") {
      return res
        .status(400)
        .json({ error: { message: "Invalid map ID", code: "INVALID_MAP_ID" } });
    }

    if (err.message === "MAP_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: { message: "Map not found", code: "MAP_NOT_FOUND" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}
