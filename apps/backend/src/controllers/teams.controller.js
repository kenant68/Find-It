import {
  getAllTeams,
  getTeam,
  getTeamWithMembers,
  getTeamByName,
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  leaveTeam,
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
    const teamData = { ...req.body, captainId: req.user.id };
    const newTeam = await createTeam(teamData);
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

    if (err.message === "USER_ALREADY_CAPTAIN") {
      return res
        .status(409)
        .json({ error: { message: "You are already captain of a team", code: "USER_ALREADY_CAPTAIN" } });
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


export async function addTeamMemberHandler(req, res) {
  try {
    const teamId = Number(req.params.id);
    const { userId, isLeader } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ error: { message: "User ID is required", code: "MISSING_USER_ID" } });
    }

    const member = await addTeamMember(teamId, userId, isLeader || false);
    res.status(201).json(member);
  } catch (err) {
    console.error("Error adding team member:", err);

    if (err.message === "TEAM_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: { message: "Team not found", code: "TEAM_NOT_FOUND" } });
    }

    if (err.message === "USER_ALREADY_MEMBER") {
      return res
        .status(409)
        .json({ error: { message: "User is already a member of this team", code: "USER_ALREADY_MEMBER" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function removeTeamMemberHandler(req, res) {
  try {
    const teamId = Number(req.params.id);
    const userId = Number(req.params.userId);

    await removeTeamMember(teamId, userId);
    res.status(204).send();
  } catch (err) {
    console.error("Error removing team member:", err);

    if (err.message === "TEAM_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: { message: "Team not found", code: "TEAM_NOT_FOUND" } });
    }

    if (err.message === "USER_NOT_MEMBER") {
      return res
        .status(404)
        .json({ error: { message: "User is not a member of this team", code: "USER_NOT_MEMBER" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function leaveTeamHandler(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ error: { message: "Authentication required", code: "AUTH_REQUIRED" } });
    }

    const result = await leaveTeam(userId);
    res.json({ message: "Successfully left team", ...result });
  } catch (err) {
    console.error("Error leaving team:", err);

    if (err.message === "USER_NOT_IN_TEAM") {
      return res
        .status(404)
        .json({ error: { message: "You are not in any team", code: "USER_NOT_IN_TEAM" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}