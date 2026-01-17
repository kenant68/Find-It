import {
  getAllTeams,
  getTeam,
  getTeamWithMembers,
  getTeamByName,
  createTeam,
  updateTeam,
  deleteTeam,
} from "../services/teams.service.js";

export async function getTeams(req, res) {
  try {
    const teams = await getAllTeams();
    res.json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getTeamById(req, res) {
  try {
    const id = Number(req.params.id);
    const team = await getTeam(id);

    if (!team) {
      return res
        .status(404)
        .json({ error: { message: "Team not found", code: "TEAM_NOT_FOUND" } });
    }

    res.json(team);
  } catch (err) {
    console.error("Error fetching team by ID:", err);
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getTeamByIdWithMembersHandler(req, res) {
  try {
    const id = Number(req.params.id);
    const team = await getTeamWithMembers(id);

    if (!team) {
      return res
        .status(404)
        .json({ error: { message: "Team not found", code: "TEAM_NOT_FOUND" } });
    }

    res.json(team);
  } catch (err) {
    console.error("Error fetching team with members:", err);
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getTeamByNameHandler(req, res) {
  try {
    const { name } = req.params;
    const team = await getTeamByName(name);

    if (!team) {
      return res
        .status(404)
        .json({ error: { message: "Team not found", code: "TEAM_NOT_FOUND" } });
    }

    res.json(team);
  } catch (err) {
    console.error("Error fetching team by name:", err);
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function createTeamHandler(req, res) {
  try {
    const newTeam = await createTeam(req.body);
    res.status(201).json(newTeam);
  } catch (err) {
    console.error("Error creating team:", err);

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

export async function updateTeamHandler(req, res) {
  try {
    const id = Number(req.params.id);
    const updatedTeam = await updateTeam(id, req.body);

    res.json(updatedTeam);
  } catch (err) {
    console.error("Error updating team:", err);

    if (err.message === "TEAM_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: { message: "Team not found", code: "TEAM_NOT_FOUND" } });
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

export async function deleteTeamHandler(req, res) {
  try {
    const id = Number(req.params.id);
    await deleteTeam(id);

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting team:", err);

    if (err.message === "TEAM_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: { message: "Team not found", code: "TEAM_NOT_FOUND" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}