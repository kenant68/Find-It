import { prisma } from "../lib/prisma.js";

export async function findAll() {
  return await prisma.map.findMany();
}

export async function findById(id) {
  return await prisma.map.findUnique({
    where: { id: Number(id) },
  });
}

export async function findByTitle(title) {
  return await prisma.map.findUnique({
    where: { title: title.trim() },
  });
}

export async function create(data) {
  const mapData = { ...data };

  if (mapData.title) {
    mapData.title = mapData.title.trim();
  }

  return await prisma.map.create({
    data: mapData,
  });
}

export async function update(id, data) {
  const updateData = { ...data };

  if (updateData.title) {
    updateData.title = updateData.title.trim();
  }

  return await prisma.map.update({
    where: { id: Number(id) },
    data: updateData,
  });
}

export async function remove(id) {
  return await prisma.map.delete({
    where: { id: Number(id) },
  });
}
