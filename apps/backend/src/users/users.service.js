import { findAll, findById, findByUsername, findByEmail, addUser } from "./users.repository.js";

export function getAllUsers() {
  return findAll();
}

export function getUser(id) {
  return findById(id);
}

export function createUser(userData) {
  let { username, email, region } = userData;

  if (!username || !email || !region) {
    throw new Error("INVALID_PAYLOAD");
  }

  username = username.trim().toLowerCase();
  email = email.trim().toLowerCase();

  const emailPattern = /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  if (!emailPattern.test(email)) {
    throw new Error("INVALID_EMAIL");
  }

  const existingByUsername = findByUsername(username);
  if (existingByUsername) {
    throw new Error("USERNAME_ALREADY_EXISTS");
  }

  const existingByEmail = findByEmail(email);
  if (existingByEmail) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  return addUser({ username, email, region });
}