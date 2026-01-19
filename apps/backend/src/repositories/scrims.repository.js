import { prisma } from "../lib/prisma.js";

export async function findAll() {
  return await prisma.scrim.findMany({
    include: {
      teamA: true,
      teamB: true,
      map: true,
    },
  });
}

export async function findById(id) {
  return await prisma.scrim.findUnique({
    where: { id: Number(id) },
    include: {
      teamA: true,
      teamB: true,
      map: true,
    },
  });
}

export async function findByTeamId(teamId) {
  return await prisma.scrim.findMany({
    where: {
      OR: [
        { teamAId: Number(teamId) },
        { teamBId: Number(teamId) },
      ],
    },
    include: {
      teamA: true,
      teamB: true,
      map: true,
    },
  });
}

export async function findByStatus(status) {
  return await prisma.scrim.findMany({
    where: { status },
    include: {
      teamA: true,
      teamB: true,
      map: true,
    },
  });
}

export async function create(data) {
  return await prisma.scrim.create({
    data: {
      horaire: data.horaire,
      teamAId: Number(data.teamAId),
      teamBId: Number(data.teamBId),
      mapId: Number(data.mapId),
      status: data.status || "scheduled",
    },
    include: {
      teamA: true,
      teamB: true,
      map: true,
    },
  });
}

export async function update(id, data) {
  const updateData = {};

  if (data.horaire !== undefined) updateData.horaire = data.horaire;
  if (data.teamAId !== undefined) updateData.teamAId = Number(data.teamAId);
  if (data.teamBId !== undefined) updateData.teamBId = Number(data.teamBId);
  if (data.mapId !== undefined) updateData.mapId = Number(data.mapId);
  if (data.status !== undefined) updateData.status = data.status;

  return await prisma.scrim.update({
    where: { id: Number(id) },
    data: updateData,
    include: {
      teamA: true,
      teamB: true,
      map: true,
    },
  });
}

export async function remove(id) {
  return await prisma.scrim.delete({
    where: { id: Number(id) },
  });
}
