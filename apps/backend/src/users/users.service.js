import { findAll, findById, findByUsername, addUser } from "./users.repository.js";

export function getAllUsers() {
  return findAll();
}

export function getUser(id) {
  return findById(id);
}

export function createUser(userData) {
  const existing = findByUsername(userData.username);
  if (existing) {
    throw new Error("USERNAME_ALREADY_EXISTS");
  }
  return addUser(userData);
}