import { findAll, findById, findByIdWithMembers, findByName, create, update, remove } from "../repositories/teams.repository.js";

export async function getAllTeams() {
  return await findAll();
}

export async function getTeam(id) {
  return await findById(id);
}

export async function getTeamWithMembers(id) {
  return await findByIdWithMembers(id);
}

export async function getTeamByName(name) {
  return await findByName(name);
}

export async function createTeam(teamData) {
  let { name, region, eloAvg, logoUrl, bannerUrl, captainId } = teamData;

  if (!name) {
    throw new Error("INVALID_PAYLOAD");
  }

  name = name.trim().toLowerCase();

  if (region) {
    region = region.trim();
  }

  if (eloAvg !== undefined && eloAvg !== null) {
    const parsed = Number(eloAvg);
    if (Number.isNaN(parsed) || parsed < 0) {
      throw new Error("INVALID_ELO");
    }
    eloAvg = parsed;
  }

  const existingByName = await findByName(name);
  if (existingByName) {
    throw new Error("TEAM_NAME_ALREADY_EXISTS");
  }

  return await create({
    name,
    region,
    eloAvg,
    logoUrl,
    bannerUrl,
    captainId,
  });
}

export async function updateTeam(id, teamData) {
  const existingTeam = await findById(id);
  if (!existingTeam) {
    throw new Error("TEAM_NOT_FOUND");
  }

  if (teamData.name) {
    const existingByName = await findByName(teamData.name);
    if (existingByName && existingByName.id !== Number(id)) {
      throw new Error("TEAM_NAME_ALREADY_EXISTS");
    }
  }

  if (teamData.eloAvg !== undefined && teamData.eloAvg !== null) {
    const parsed = Number(teamData.eloAvg);
    if (Number.isNaN(parsed) || parsed < 0) {
      throw new Error("INVALID_ELO");
    }
    teamData.eloAvg = parsed;
  }

  return await update(id, teamData);
}

export async function deleteTeam(id) {
  const existingTeam = await findById(id);
  if (!existingTeam) {
    throw new Error("TEAM_NOT_FOUND");
  }

  return await remove(id);
}