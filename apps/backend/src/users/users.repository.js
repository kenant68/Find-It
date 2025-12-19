import { dbData } from "../utils/db.js";

const users = dbData.users
  .filter(
    (user) =>
      user &&
      typeof user.id !== "undefined" &&
      typeof user.username === "string" &&
      typeof user.email === "string"
  )
  .map((user) => ({
    id: Number(user.id),
    username: user.username.toLowerCase(),
    email: user.email.toLowerCase(),
    region: typeof user.region === "string" ? user.region : null
  }));

let nextId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

export function findAll() {
  return users;
}

export function findById(id) {
  return users.find((user) => user.id === id) || null;
}

export function findByUsername(username) {
  const normalized = username.trim().toLowerCase()
  return users.find((user) => user.username === normalized) || null;
}

export function findByEmail(email) {
  const normalized = email.trim().toLowerCase();
  return users.find((user) => user.email === normalized) || null;
}

export function addUser({ username, email, region }) {
  const newUser = {
    id: nextId++,
    username,
    email,
    region
  };
  users.push(newUser);
  return newUser;
}
