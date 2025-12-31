import { findAll, findById, findByName, addTeam } from "../repositories/teams.repository.js";

export function getAllTeams() {
  return findAll();
}

export function getTeam(id) {
  return findById(id);
}

export function createTeam(teamData) {
  let { name, region, eloAvg } = teamData;

  if (!name || !region) {
    throw new Error("INVALID_PAYLOAD");
  }

  name = name.trim().toLowerCase();
  region = region.trim();

  if (eloAvg !== undefined && eloAvg !== null) {
    const parsed = Number(eloAvg);
    if (Number.isNaN(parsed) || parsed < 0) {
      throw new Error("INVALID_ELO");
    }
    eloAvg = parsed;
  }

  const existingByName = findByName(name);
  if (existingByName) {
    throw new Error("TEAM_NAME_ALREADY_EXISTS");
  }

  return addTeam({ name, region, eloAvg });
}