import { dbData } from "../utils/db.js";

const matches = dbData.matches
  .filter(
    (match) =>
      match &&
      typeof match.id !== "undefined" &&
      typeof match.teamA !== "undefined" &&
      typeof match.teamB !== "undefined" &&
      typeof match.scoreA !== "undefined" &&
      typeof match.scoreB !== "undefined"
  )
  .map((match) => ({
    id: Number(match.id) || 0,
    teamA: typeof match.teamA === "string" ? match.teamA : String(match.teamA),
    teamB: typeof match.teamB === "string" ? match.teamB : String(match.teamB),
    scoreA: Number(match.scoreA) || 0,
    scoreB: Number(match.scoreB) || 0,
    mapId: match.mapId !== undefined && match.mapId !== null ? Number(match.mapId) : null
  }));

let nextId = matches.length > 0 ? Math.max(...matches.map((match) => match.id)) + 1 : 1;

export function findAll() {
  return matches;
}

export function findById(id) {
  return matches.find((match) => match.id === id) || null;
}

export function findByTeamName(teamName) {
  const normalizedTeamName = typeof teamName === "string" ? teamName.trim().toLowerCase() : String(teamName).toLowerCase();
  return matches.filter(
    (match) =>
      match.teamA.toLowerCase() === normalizedTeamName ||
      match.teamB.toLowerCase() === normalizedTeamName
  );
}

export function addMatch({ teamA, teamB, scoreA, scoreB, mapId }) {
  const newMatch = {
    id: nextId++,
    teamA,
    teamB,
    scoreA,
    scoreB,
    mapId: mapId !== undefined && mapId !== null ? Number(mapId) : null
  };
  matches.push(newMatch);
  return newMatch;
}
