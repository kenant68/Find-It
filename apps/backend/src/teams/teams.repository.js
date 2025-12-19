import { dbData } from "../utils/db.js";

const teams = dbData.teams
  .filter((team) => team && typeof team.id !== "undefined" && typeof team.name === "string")
  .map((team) => ({
    id: Number(team.id) || 0,
    name: team.name?.toLowerCase() || "unknown",
    region: typeof team.region === "string" ? team.region : null,
    eloAvg: null
  }));

let nextId = teams.length > 0 ? Math.max(...teams.map((team) => team.id)) + 1 : 1;

export function findAll() {
  return teams;
}

export function findById(id) {
  return teams.find((team) => team.id === id) || null;
}

export function findByName(name) {
  const normalized = name.trim().toLowerCase();
  return teams.find((team) => team.name === normalized) || null;
}

export function addTeam({ name, region, eloAvg }) {
  const newTeam = {
    id: nextId++,
    name,
    region,
    eloAvg
  };
  teams.push(newTeam);
  return newTeam;
}