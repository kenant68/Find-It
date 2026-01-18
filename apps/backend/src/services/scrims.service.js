import { findAll, findById, findByTeamId, findByStatus, create, update, remove } from "../repositories/scrims.repository.js";

export async function getAllScrims() {
  return await findAll();
}

export async function getScrim(id) {
  return await findById(id);
}

export async function getScrimsByTeam(teamId) {
  return await findByTeamId(teamId);
}

export async function getScrimsByStatus(status) {
  return await findByStatus(status);
}

export async function createScrim(scrimData) {
  let { teamAId, teamBId, mapId, horaire, status } = scrimData;

  if (!teamAId || !teamBId || !mapId || !horaire) {
    throw new Error("INVALID_PAYLOAD");
  }

  teamAId = Number(teamAId);
  teamBId = Number(teamBId);
  mapId = Number(mapId);

  if (Number.isNaN(teamAId) || teamAId <= 0) {
    throw new Error("INVALID_TEAM_A");
  }

  if (Number.isNaN(teamBId) || teamBId <= 0) {
    throw new Error("INVALID_TEAM_B");
  }

  if (teamAId === teamBId) {
    throw new Error("TEAMS_MUST_BE_DIFFERENT");
  }

  if (Number.isNaN(mapId) || mapId <= 0) {
    throw new Error("INVALID_MAP_ID");
  }

  if (horaire && typeof horaire === "string") {
    horaire = horaire.trim();
    const timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timePattern.test(horaire)) {
      throw new Error("INVALID_HORAIRE");
    }
  }

  return await create({
    horaire,
    teamAId,
    teamBId,
    mapId,
    status,
  });
}

export async function updateScrim(id, scrimData) {
  const existingScrim = await findById(id);
  if (!existingScrim) {
    throw new Error("SCRIM_NOT_FOUND");
  }

  if (scrimData.teamAId !== undefined) {
    scrimData.teamAId = Number(scrimData.teamAId);
    if (Number.isNaN(scrimData.teamAId) || scrimData.teamAId <= 0) {
      throw new Error("INVALID_TEAM_A");
    }
  }

  if (scrimData.teamBId !== undefined) {
    scrimData.teamBId = Number(scrimData.teamBId);
    if (Number.isNaN(scrimData.teamBId) || scrimData.teamBId <= 0) {
      throw new Error("INVALID_TEAM_B");
    }
  }

  const finalTeamAId = scrimData.teamAId ?? existingScrim.teamAId;
  const finalTeamBId = scrimData.teamBId ?? existingScrim.teamBId;

  if (finalTeamAId === finalTeamBId) {
    throw new Error("TEAMS_MUST_BE_DIFFERENT");
  }

  if (scrimData.mapId !== undefined) {
    scrimData.mapId = Number(scrimData.mapId);
    if (Number.isNaN(scrimData.mapId) || scrimData.mapId <= 0) {
      throw new Error("INVALID_MAP_ID");
    }
  }

  if (scrimData.horaire && typeof scrimData.horaire === "string") {
    scrimData.horaire = scrimData.horaire.trim();
    const timePattern = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timePattern.test(scrimData.horaire)) {
      throw new Error("INVALID_HORAIRE");
    }
  }

  return await update(id, scrimData);
}

export async function deleteScrim(id) {
  const existingScrim = await findById(id);
  if (!existingScrim) {
    throw new Error("SCRIM_NOT_FOUND");
  }

  return await remove(id);
}
