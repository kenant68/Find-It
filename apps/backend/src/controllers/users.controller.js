import {
  getAllUsers,
  getUser,
  getUserByUsername,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
} from "../services/users.service.js";

export async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getUserById(req, res) {
  try {
    const id = Number(req.params.id);
    const user = await getUser(id);

    if (!user) {
      return res
        .status(404)
        .json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getUserByUsernameHandler(req, res) {
  try {
    const { username } = req.params;
    const user = await getUserByUsername(username);

    if (!user) {
      return res
        .status(404)
        .json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user by username:", err);
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getUserByEmailHandler(req, res) {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);

    if (!user) {
      return res
        .status(404)
        .json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user by email:", err);
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function createUserHandler(req, res) {
  try {
    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);

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

export async function updateUserHandler(req, res) {
  try {
    const id = Number(req.params.id);
    const updatedUser = await updateUser(id, req.body);

    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);

    if (err.message === "USER_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
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

export async function deleteUserHandler(req, res) {
  try {
    const id = Number(req.params.id);
    await deleteUser(id);

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting user:", err);

    if (err.message === "USER_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}