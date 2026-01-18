import bcrypt from "bcryptjs";
import {
  findAll,
  findById,
  findByUsername,
  findByEmail,
  create,
  update,
  remove,
  updatePassword as updatePasswordRepo,
} from "../repositories/users.repository.js";

export async function getAllUsers() {
  return await findAll();
}

export async function getUser(id) {
  return await findById(id);
}

export async function getUserByUsername(username) {
  return await findByUsername(username);
}

export async function getUserByEmail(email) {
  return await findByEmail(email);
}

export async function createUser(userData) {
  let { username, email, password, region, avatarUrl, faceitId, faceitLevel, steamUrl, discordUsername } = userData;
  if (!username || !email || !password) throw new Error("INVALID_PAYLOAD");

  username = username.trim();
  email = email.trim().toLowerCase();

  const emailPattern = /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  if (!emailPattern.test(email)) throw new Error("INVALID_EMAIL");

  if (await findByUsername(username)) throw new Error("USERNAME_ALREADY_EXISTS");
  if (await findByEmail(email)) throw new Error("EMAIL_ALREADY_EXISTS");

  const passwordHash = await bcrypt.hash(password, 10);

  return await create({ username, email, passwordHash, region, avatarUrl, faceitId, faceitLevel, steamUrl, discordUsername });
}

export async function updateUser(id, userData) {
  const existingUser = await findById(id);
  if (!existingUser) throw new Error("USER_NOT_FOUND");

  if (userData.email) {
    const emailPattern = /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(userData.email)) throw new Error("INVALID_EMAIL");
    const existingByEmail = await findByEmail(userData.email);
    if (existingByEmail && existingByEmail.id !== Number(id)) throw new Error("EMAIL_ALREADY_EXISTS");
  }

  if (userData.username) {
    const existingByUsername = await findByUsername(userData.username);
    if (existingByUsername && existingByUsername.id !== Number(id)) throw new Error("USERNAME_ALREADY_EXISTS");
  }

  return await update(id, userData);
}

export async function deleteUser(id) {
  const existingUser = await findById(id);
  if (!existingUser) throw new Error("USER_NOT_FOUND");
  return await remove(id);
}

export async function updateUserPassword(id, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  return await updatePasswordRepo(id, passwordHash);
}
