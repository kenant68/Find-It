import { findAll, findById, findByIdWithMembers, findByName, create, update, remove, addMember, removeMember, findMember } from "../repositories/teams.repository.js";

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

  if (!name || !captainId) {
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

  const existingTeams = await findAll();
  const userIsCaptain = existingTeams.some(team => team.captainId === captainId);
  if (userIsCaptain) {
    throw new Error("USER_ALREADY_CAPTAIN");
  }

  const existingByName = await findByName(name);
  if (existingByName) {
    throw new Error("TEAM_NAME_ALREADY_EXISTS");
  }

  const newTeam = await create({
    name,
    region,
    eloAvg,
    logoUrl,
    bannerUrl,
    captainId,
  });

  await addMember(newTeam.id, captainId, true);

  return newTeam;
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

// === TEAM MEMBERS ===

export async function addTeamMember(teamId, userId, isLeader = false) {
  const team = await findById(teamId);
  if (!team) {
    throw new Error("TEAM_NOT_FOUND");
  }

  // Vérifier si l'utilisateur n'est pas déjà membre
  const existingMember = await findMember(teamId, userId);
  if (existingMember) {
    throw new Error("USER_ALREADY_MEMBER");
  }

  return await addMember(teamId, userId, isLeader);
}

export async function removeTeamMember(teamId, userId) {
  const team = await findById(teamId);
  if (!team) {
    throw new Error("TEAM_NOT_FOUND");
  }

  const member = await findMember(teamId, userId);
  if (!member) {
    throw new Error("USER_NOT_MEMBER");
  }

  if (member.isLeader) {
    const teamWithMembers = await findByIdWithMembers(teamId);
    if (teamWithMembers.members.length <= 1) {
      await remove(teamId);
      return { teamDeleted: true };
    } else {
      const nextMember = teamWithMembers.members.find(m => !m.isLeader);
      if (nextMember) {
        await prisma.teamMember.update({
          where: { userId_teamId: { userId: nextMember.userId, teamId: teamId } },
          data: { isLeader: true }
        });
      }
    }
  }

  return await removeMember(teamId, userId);
}

export async function leaveTeam(userId) {
  const allTeams = await findAll();
  for (const team of allTeams) {
    const teamWithMembers = await findByIdWithMembers(team.id);
    const member = teamWithMembers.members.find(m => m.userId === userId);
    if (member) {
      return await removeTeamMember(team.id, userId);
    }
  }
  throw new Error("USER_NOT_IN_TEAM");
}