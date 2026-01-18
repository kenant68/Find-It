import { prisma } from "../lib/prisma.ts";

export async function findAll() {
  return await prisma.team.findMany();
}

export async function findById(id) {
  return await prisma.team.findUnique({
    where: { id: Number(id) },
  });
}

export async function findByIdWithMembers(id) {
  return await prisma.team.findUnique({
    where: { id: Number(id) },
    include: {
      captain: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  });
}

export async function findByName(name) {
  return await prisma.team.findUnique({
    where: { name: name.trim().toLowerCase() },
  });
}

export async function create(data) {
  const teamData = { ...data };

  if (teamData.name) {
    teamData.name = teamData.name.trim().toLowerCase();
  }

  return await prisma.team.create({
    data: teamData,
  });
}

export async function update(id, data) {
  const updateData = { ...data };

  if (updateData.name) {
    updateData.name = updateData.name.trim().toLowerCase();
  }

  return await prisma.team.update({
    where: { id: Number(id) },
    data: updateData,
  });
}

export async function remove(id) {
  return await prisma.team.delete({
    where: { id: Number(id) },
  });
}


export async function addMember(teamId, userId, isLeader = false) {
  return await prisma.teamMember.create({
    data: {
      teamId: Number(teamId),
      userId: Number(userId),
      isLeader: isLeader,
    },
  });
}

export async function removeMember(teamId, userId) {
  return await prisma.teamMember.delete({
    where: {
      userId_teamId: {
        userId: Number(userId),
        teamId: Number(teamId),
      },
    },
  });
}

export async function findMember(teamId, userId) {
  return await prisma.teamMember.findUnique({
    where: {
      userId_teamId: {
        userId: Number(userId),
        teamId: Number(teamId),
      },
    },
  });
}