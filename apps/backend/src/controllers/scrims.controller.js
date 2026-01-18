import {
  getAllScrims,
  getScrim,
  getScrimsByTeam,
  getScrimsByStatus,
  createScrim,
  updateScrim,
  deleteScrim,
} from "../services/scrims.service.js";

export async function getScrims(req, res) {
  try {
    const scrims = await getAllScrims();
    res.json(scrims);
  } catch (err) {
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getScrimById(req, res) {
  try {
    const id = Number(req.params.id);
    const scrim = await getScrim(id);

    if (!scrim) {
      return res
        .status(404)
        .json({ error: { message: "Scrim not found", code: "SCRIM_NOT_FOUND" } });
    }

    res.json(scrim);
  } catch (err) {
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getScrimsByTeamHandler(req, res) {
  try {
    const teamId = Number(req.params.teamId);
    const scrims = await getScrimsByTeam(teamId);
    res.json(scrims);
  } catch (err) {
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getScrimsByStatusHandler(req, res) {
  try {
    const { status } = req.params;
    const scrims = await getScrimsByStatus(status);
    res.json(scrims);
  } catch (err) {
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

function handleScrimError(err, res) {
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

  if (err.message === "SCRIM_NOT_FOUND") {
    return res
      .status(404)
      .json({ error: { message: "Scrim not found", code: "SCRIM_NOT_FOUND" } });
  }

  return res
    .status(500)
    .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
}

export async function createScrimHandler(req, res) {
  try {
    const newScrim = await createScrim(req.body);
    res.status(201).json(newScrim);
  } catch (err) {
    handleScrimError(err, res);
  }
}

export async function updateScrimHandler(req, res) {
  try {
    const id = Number(req.params.id);
    const updatedScrim = await updateScrim(id, req.body);

    res.json(updatedScrim);
  } catch (err) {
    handleScrimError(err, res);
  }
}

export async function deleteScrimHandler(req, res) {
  try {
    const id = Number(req.params.id);
    await deleteScrim(id);

    res.status(204).send();
  } catch (err) {
    handleScrimError(err, res);
  }
}
