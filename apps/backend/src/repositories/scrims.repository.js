import { dbData } from "../utils/db.js";

const scrims = dbData.scrims
  .filter(
    (scrim) =>
      scrim &&
      typeof scrim.id !== "undefined" &&
      typeof scrim.teamA !== "undefined" &&
      typeof scrim.teamB !== "undefined" &&
      typeof scrim.mapId !== "undefined"
  )
  .map((scrim) => ({
    id: Number(scrim.id) || 0,
    horaire: typeof scrim.horaire === "string" ? scrim.horaire : null,
    teamA: Number(scrim.teamA) || 0,
    teamB: Number(scrim.teamB) || 0,
    mapId: Number(scrim.mapId) || 0
  }));

let nextId = scrims.length > 0 ? Math.max(...scrims.map((scrim) => scrim.id)) + 1 : 1;

export function findAll() {
  return scrims;
}

export function findById(id) {
  return scrims.find((scrim) => scrim.id === id) || null;
}

export function findByTeamId(teamId) {
  const teamIdNum = Number(teamId);
  return scrims.filter(
    (scrim) => scrim.teamA === teamIdNum || scrim.teamB === teamIdNum
  );
}

export function addScrim({ horaire, teamA, teamB, mapId }) {
  const newScrim = {
    id: nextId++,
    horaire,
    teamA,
    teamB,
    mapId
  };
  scrims.push(newScrim);
  return newScrim;
}
