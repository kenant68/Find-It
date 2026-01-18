import {
  getAllUsers,
  getUser,
  getUserByUsername,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
} from "../services/users.service.js";

export async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await getUser(Number(req.params.id));
    if (!user) return res.status(404).json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getUserByUsernameHandler(req, res) {
  try {
    const user = await getUserByUsername(req.params.username);
    if (!user) return res.status(404).json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getUserByEmailHandler(req, res) {
  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function createUserHandler(req, res) {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    if (["INVALID_PAYLOAD", "INVALID_EMAIL", "USERNAME_ALREADY_EXISTS", "EMAIL_ALREADY_EXISTS"].includes(err.message)) {
      const status = err.message === "INVALID_PAYLOAD" || err.message === "INVALID_EMAIL" ? 400 : 409;
      return res.status(status).json({ error: { message: err.message.replace(/_/g, " "), code: err.message } });
    }
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function updateUserHandler(req, res) {
  try {
    const updatedUser = await updateUser(Number(req.params.id), req.body);
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    if (["USER_NOT_FOUND", "INVALID_EMAIL", "USERNAME_ALREADY_EXISTS", "EMAIL_ALREADY_EXISTS"].includes(err.message)) {
      const status = err.message === "USER_NOT_FOUND" ? 404 : err.message === "INVALID_EMAIL" ? 400 : 409;
      return res.status(status).json({ error: { message: err.message.replace(/_/g, " "), code: err.message } });
    }
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function deleteUserHandler(req, res) {
  try {
    await deleteUser(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    if (err.message === "USER_NOT_FOUND") return res.status(404).json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function updatePasswordHandler(req, res) {
  try {
    await updateUserPassword(Number(req.params.id), req.body.passwordHash);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}
