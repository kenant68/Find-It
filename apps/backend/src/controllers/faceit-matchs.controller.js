import { getFaceitStatsByUserId } from "../services/faceit.service.js";
import { findById } from "../repositories/users.repository.js";

export async function getFaceitStatsHandler(req, res) {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res
        .status(400)
        .json({ error: { message: "User ID required", code: "USER_ID_REQUIRED" } });
    }

    const user = await findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ error: { message: "User not found", code: "USER_NOT_FOUND" } });
    }

    if (!user.faceitId) {
      return res
        .status(404)
        .json({ error: { message: "FACEIT ID not configured for this user", code: "FACEIT_ID_NOT_CONFIGURED" } });
    }

    const stats = await getFaceitStatsByUserId(Number(userId), user.faceitId);

    res.json(stats);
  } catch (err) {
    if (err.message === "FACEIT_PLAYER_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: { message: "FACEIT player not found", code: "FACEIT_PLAYER_NOT_FOUND" } });
    }

    if (err.message === "FACEIT_API_KEY_INVALID") {
      return res
        .status(500)
        .json({ error: { message: "FACEIT API configuration error", code: "FACEIT_API_ERROR" } });
    }

    if (err.message === "FACEIT_API_UNAVAILABLE") {
      return res
        .status(503)
        .json({ error: { message: "FACEIT service temporarily unavailable", code: "FACEIT_UNAVAILABLE" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getRecentMatchesHandler(req, res) {
  try {
    const userId = req.params.userId || req.user?.id;
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;

    if (!userId) {
      return res
        .status(400)
        .json({ error: { message: "User ID required", code: "USER_ID_REQUIRED" } });
    }

    if (limit < 1 || limit > 20) {
      return res
        .status(400)
        .json({ error: { message: "Limit must be between 1 and 20", code: "INVALID_LIMIT" } });
    }

    const user = await findById(userId);
    if (!user || !user.faceitId) {
      return res
        .status(404)
        .json({ error: { message: "FACEIT ID not found for this user", code: "FACEIT_ID_NOT_FOUND" } });
    }

    const { getRecentMatches } = await import("../services/faceit.service.js");
    const matches = await getRecentMatches(user.faceitId);

    const limitedMatches = matches.slice(0, limit);

    res.json({
      matches: limitedMatches,
      total: matches.length,
      limit: limit
    });
  } catch (err) {
    if (err.message === "FACEIT_PLAYER_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: { message: "FACEIT player not found", code: "FACEIT_PLAYER_NOT_FOUND" } });
    }

    if (err.message === "FACEIT_API_UNAVAILABLE") {
      return res
        .status(503)
        .json({ error: { message: "FACEIT service temporarily unavailable", code: "FACEIT_UNAVAILABLE" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}