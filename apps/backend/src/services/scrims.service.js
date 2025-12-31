import { findAll, findById, findByTeamId, addScrim } from "../repositories/scrims.repository.js";

export function getAllScrims() {
  return findAll();
}

export function getScrim(id) {
  return findById(id);
}

export function getScrimsByTeam(teamId) {
  return findByTeamId(teamId);
}

export function createScrim(scrimData) {
  let { teamA, teamB, mapId, horaire } = scrimData;

  if (!teamA || !teamB || !mapId) {
    throw new Error("INVALID_PAYLOAD");
  }

  teamA = Number(teamA);
  teamB = Number(teamB);
  mapId = Number(mapId);

  if (Number.isNaN(teamA) || teamA <= 0) {
    throw new Error("INVALID_TEAM_A");
  }

  if (Number.isNaN(teamB) || teamB <= 0) {
    throw new Error("INVALID_TEAM_B");
  }

  if (teamA === teamB) {
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

  return addScrim({ horaire: horaire || null, teamA, teamB, mapId });
}
