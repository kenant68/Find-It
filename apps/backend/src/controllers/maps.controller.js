import { getAllMaps, getMap, createMap } from "../services/maps.service.js";

export function getMaps(req, res) {
  const maps = getAllMaps();
  res.json(maps);
}

export function getMapById(req, res) {
  const id = Number(req.params.id);
  const map = getMap(id);

  if (!map) {
    return res
      .status(404)
      .json({ error: { message: "Map not found", code: "MAP_NOT_FOUND" } });
  }

  res.json(map);
}

export function createMapHandler(req, res) {
  try {
    const newMap = createMap(req.body);
    res.status(201).json(newMap);
  } catch (err) {
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
