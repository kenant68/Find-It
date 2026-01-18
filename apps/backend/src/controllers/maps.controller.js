import {
  getAllMaps,
  getMap,
  getMapByTitle,
  createMap,
  updateMap,
  deleteMap,
} from "../services/maps.service.js";

export async function getMaps(req, res) {
  try {
    console.log("[MAPS CONTROLLER] Getting all maps...");
    const maps = await getAllMaps();
    console.log(`[MAPS CONTROLLER] Found ${maps.length} maps`);
    res.json(maps);
  } catch (err) {
    console.error("[MAPS CONTROLLER] Error fetching maps:", err);
    console.error("[MAPS CONTROLLER] Stack:", err.stack);
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getMapById(req, res) {
  try {
    const id = Number(req.params.id);
    const map = await getMap(id);

    if (!map) {
      return res
        .status(404)
        .json({ error: { message: "Map not found", code: "MAP_NOT_FOUND" } });
    }

    res.json(map);
  } catch (err) {
    console.error("Error fetching map by ID:", err);
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function getMapByTitleHandler(req, res) {
  try {
    const { title } = req.params;
    const map = await getMapByTitle(title);

    if (!map) {
      return res
        .status(404)
        .json({ error: { message: "Map not found", code: "MAP_NOT_FOUND" } });
    }

    res.json(map);
  } catch (err) {
    console.error("Error fetching map by title:", err);
    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function createMapHandler(req, res) {
  try {
    const newMap = await createMap(req.body);
    res.status(201).json(newMap);
  } catch (err) {
    console.error("Error creating map:", err);

    if (err.message === "INVALID_PAYLOAD") {
      return res
        .status(400)
        .json({ error: { message: "Missing or invalid fields", code: "INVALID_PAYLOAD" } });
    }

    if (err.message === "MAP_TITLE_ALREADY_EXISTS") {
      return res
        .status(409)
        .json({ error: { message: "Map title already exists", code: "MAP_TITLE_ALREADY_EXISTS" } });
    }

    if (err.message === "INVALID_IMG_URL") {
      return res
        .status(400)
        .json({ error: { message: "Invalid image URL format", code: "INVALID_IMG_URL" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function updateMapHandler(req, res) {
  try {
    const id = Number(req.params.id);
    const updatedMap = await updateMap(id, req.body);

    res.json(updatedMap);
  } catch (err) {
    console.error("Error updating map:", err);

    if (err.message === "MAP_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: { message: "Map not found", code: "MAP_NOT_FOUND" } });
    }

    if (err.message === "MAP_TITLE_ALREADY_EXISTS") {
      return res
        .status(409)
        .json({ error: { message: "Map title already exists", code: "MAP_TITLE_ALREADY_EXISTS" } });
    }

    if (err.message === "INVALID_IMG_URL") {
      return res
        .status(400)
        .json({ error: { message: "Invalid image URL format", code: "INVALID_IMG_URL" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}

export async function deleteMapHandler(req, res) {
  try {
    const id = Number(req.params.id);
    await deleteMap(id);

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting map:", err);

    if (err.message === "MAP_NOT_FOUND") {
      return res
        .status(404)
        .json({ error: { message: "Map not found", code: "MAP_NOT_FOUND" } });
    }

    res
      .status(500)
      .json({ error: { message: "Internal server error", code: "INTERNAL_ERROR" } });
  }
}
