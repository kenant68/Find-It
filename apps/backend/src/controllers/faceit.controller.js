import { getFaceitStatsByPlayerId, getFaceitStatsByUserId } from "../services/faceit.service.js";
import { findById } from "../repositories/users.repository.js";

function handleFaceitError(err, res) {
  if (err.message === "FACEIT_PLAYER_NOT_FOUND") {
    return res
      .status(404)
      .json({ error: { message: "FACEIT player not found", code: "FACEIT_PLAYER_NOT_FOUND" } });
  }

  if (err.message === "FACEIT_API_KEY_INVALID") {
    return res
      .status(500)
      .json({ error: { message: "FACEIT API key is invalid", code: "FACEIT_API_KEY_INVALID" } });
  }

  if (err.message === "FACEIT_API_KEY_NOT_SET") {
    return res
      .status(500)
      .json({ error: { message: "FACEIT API key is not configured", code: "FACEIT_API_KEY_NOT_SET" } });
  }

  if (err.message === "FACEIT_API_FORBIDDEN") {
    return res
      .status(403)
      .json({ error: { message: "FACEIT API key does not have permission to access this resource. Please check your API key permissions.", code: "FACEIT_API_FORBIDDEN" } });
  }

  if (err.message === "FACEIT_API_UNAVAILABLE") {
    return res
      .status(503)
      .json({ error: { message: "FACEIT API is currently unavailable", code: "FACEIT_API_UNAVAILABLE" } });
  }

  if (err.message.startsWith("FACEIT_API_ERROR")) {
    return res
      .status(502)
      .json({ error: { message: `Error connecting to FACEIT API: ${err.message}`, code: err.message } });
  }

  if (err.message === "FACEIT_API_RATE_LIMIT") {
    return res
      .status(429)
      .json({ error: { message: "FACEIT API rate limit exceeded", code: "FACEIT_API_RATE_LIMIT" } });
  }

  if (err.message === "USER_ID_REQUIRED" || err.message === "FACEIT_ID_REQUIRED") {
    return res
      .status(400)
      .json({ error: { message: err.message, code: err.message } });
  }

  return res
    .status(500)
    .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
}

function getUserFaceitId(user) {
  if (!user) {
    return null;
  }

  if (user.faceit_id) {
    return user.faceit_id;
  }

  if (user.faceitId) {
    return user.faceitId;
  }

  if (user.username) {
    const username = typeof user.username === 'string' ? user.username.trim() : String(user.username);
    return username;
  }

  return null;
}

export async function getFaceitStatsHandler(req, res) {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res
        .status(400)
        .json({ error: { message: "user_id query parameter is required", code: "USER_ID_REQUIRED" } });
    }

    const userId = Number(user_id);
    if (Number.isNaN(userId)) {
      return res
        .status(400)
        .json({ error: { message: "Invalid user_id", code: "INVALID_USER_ID" } });
    }

    const user = findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    }

    const faceitId = getUserFaceitId(user);
    if (!faceitId) {
      return res
        .status(400)
        .json({ error: { message: "User does not have a FACEIT ID", code: "FACEIT_ID_NOT_SET" } });
    }

    const stats = await getFaceitStatsByUserId(userId, faceitId);
    res.json(stats);
  } catch (err) {
    return handleFaceitError(err, res);
  }
}

export async function getFaceitStatsByIdHandler(req, res) {
  try {
    const faceitPlayerId = req.params.id;

    if (!faceitPlayerId) {
      return res
        .status(400)
        .json({ error: { message: "FACEIT player ID is required", code: "FACEIT_PLAYER_ID_REQUIRED" } });
    }

    const stats = await getFaceitStatsByPlayerId(faceitPlayerId);
    res.json(stats);
  } catch (err) {
    return handleFaceitError(err, res);
  }
}

export async function getUserFaceitStatsHandler(req, res) {
  try {
    const userId = Number(req.params.id);

    if (Number.isNaN(userId)) {
      return res
        .status(400)
        .json({ error: { message: "Invalid user ID", code: "INVALID_USER_ID" } });
    }

    const user = findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    }

    const faceitId = getUserFaceitId(user);
    if (!faceitId) {
      return res
        .status(400)
        .json({ error: { message: "User does not have a FACEIT ID", code: "FACEIT_ID_NOT_SET" } });
    }

    const stats = await getFaceitStatsByUserId(userId, faceitId);
    res.json(stats);
  } catch (err) {
    return handleFaceitError(err, res);
  }
}
