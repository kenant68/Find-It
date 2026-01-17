import { prisma } from "../lib/prisma.ts";

export async function findAll() {
  return await prisma.user.findMany();
}

export async function findById(id) {
  return await prisma.user.findUnique({
    where: { id: Number(id) },
  });
}

export async function findByUsername(username) {
  return await prisma.user.findUnique({
    where: { username: username.trim().toLowerCase() },
  });
}

export async function findByEmail(email) {
  return await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

export async function create(data) {
  const userData = { ...data };

  if (userData.username) {
    userData.username = userData.username.trim().toLowerCase();
  }
  if (userData.email) {
    userData.email = userData.email.trim().toLowerCase();
  }

  return await prisma.user.create({
    data: userData,
  });
}

export async function update(id, data) {
  const updateData = { ...data };

  if (updateData.username) {
    updateData.username = updateData.username.trim().toLowerCase();
  }
  if (updateData.email) {
    updateData.email = updateData.email.trim().toLowerCase(); 
  }

  return await prisma.user.update({
    where: { id: Number(id) },
    data: updateData,
  });
}

export async function remove(id) {
  return await prisma.user.delete({
    where: { id: Number(id) },
  });
}
