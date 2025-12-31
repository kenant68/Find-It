import { findAll, findById, findByTitle, addMap } from "../repositories/maps.repository.js";

export function getAllMaps() {
  return findAll();
}

export function getMap(id) {
  return findById(id);
}

export function createMap(mapData) {
  let { title, img } = mapData;

  if (!title) {
    throw new Error("INVALID_PAYLOAD");
  }

  title = title.trim();

  if (!title) {
    throw new Error("INVALID_PAYLOAD");
  }

  const existingByTitle = findByTitle(title);
  if (existingByTitle) {
    throw new Error("MAP_TITLE_ALREADY_EXISTS");
  }

  if (img && typeof img === "string") {
    img = img.trim();
    if (img && !img.startsWith("http://") && !img.startsWith("https://")) {
      throw new Error("INVALID_IMG_URL");
    }
  }

  return addMap({ title, img: img || null });
}
