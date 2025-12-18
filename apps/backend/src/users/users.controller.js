import { getAllUsers, getUser, createUser } from "./users.service.js";

export function getUsers(req, res) {
  const users = getAllUsers();
  res.json(users);
}

export function getUserById(req, res) {
  const id = Number(req.params.id);
  const user = getUser(id);

  if (!user) {
    return res
      .status(404)
      .json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
  }

  res.json(user);
}

export function createUserHandler(req, res) {
  try {
    const newUser = createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    if (err.message === "INVALID_PAYLOAD") {
      return res
        .status(400)
        .json({ error: { message: "Missing or invalid fields", code: "INVALID_PAYLOAD" } });
    }

    if (err.message === "INVALID_EMAIL") {
      return res
        .status(400)
        .json({ error: { message: "Invalid email format", code: "INVALID_EMAIL" } });
    }

    if (err.message === "USERNAME_ALREADY_EXISTS") {
      return res
        .status(409)
        .json({ error: { message: "Username already exists", code: "USERNAME_ALREADY_EXISTS" } });
    }

    if (err.message === "EMAIL_ALREADY_EXISTS") {
      return res
        .status(409)
        .json({ error: { message: "Email already exists", code: "EMAIL_ALREADY_EXISTS" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}