import { dbData } from "../utils/db.js";

const teams = dbData.teams.map((team) => ({
  id: Number(team.id),
  name: team.name.toLowerCase(),
  region: team.region || null,
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