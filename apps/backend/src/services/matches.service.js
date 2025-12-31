import { findAll, findById, findByTeamName, addMatch } from "../repositories/matches.repository.js";
import { findById as findMapById } from "../repositories/maps.repository.js";

export function getAllMatches() {
  return findAll();
}

export function getMatch(id) {
  return findById(id);
}

export function getMatchesByTeam(teamName) {
  return findByTeamName(teamName);
}

export function createMatch(matchData) {
  let { teamA, teamB, scoreA, scoreB, mapId } = matchData;

  if (!teamA || !teamB || scoreA === undefined || scoreB === undefined) {
    throw new Error("INVALID_PAYLOAD");
  }

  teamA = typeof teamA === "string" ? teamA.trim() : String(teamA).trim();
  teamB = typeof teamB === "string" ? teamB.trim() : String(teamB).trim();

  if (!teamA || !teamB) {
    throw new Error("INVALID_PAYLOAD");
  }

  if (teamA.toLowerCase() === teamB.toLowerCase()) {
    throw new Error("TEAMS_MUST_BE_DIFFERENT");
  }

  scoreA = Number(scoreA);
  scoreB = Number(scoreB);

  if (Number.isNaN(scoreA) || scoreA < 0) {
    throw new Error("INVALID_SCORE_A");
  }

  if (Number.isNaN(scoreB) || scoreB < 0) {
    throw new Error("INVALID_SCORE_B");
  }

  if (mapId !== undefined && mapId !== null) {
    mapId = Number(mapId);
    if (Number.isNaN(mapId) || mapId <= 0) {
      throw new Error("INVALID_MAP_ID");
    }
    const map = findMapById(mapId);
    if (!map) {
      throw new Error("MAP_NOT_FOUND");
    }
  } else {
    mapId = null;
  }

  return addMatch({ teamA, teamB, scoreA, scoreB, mapId });
}
