import { findAll, findById, findByTitle, create, update, remove } from "../repositories/maps.repository.js";

export async function getAllMaps() {
  return await findAll();
}

export async function getMap(id) {
  return await findById(id);
}

export async function getMapByTitle(title) {
  return await findByTitle(title);
}

export async function createMap(mapData) {
  let { title, img } = mapData;

  if (!title) {
    throw new Error("INVALID_PAYLOAD");
  }

  title = title.trim();

  if (!title) {
    throw new Error("INVALID_PAYLOAD");
  }

  const existingByTitle = await findByTitle(title);
  if (existingByTitle) {
    throw new Error("MAP_TITLE_ALREADY_EXISTS");
  }

  if (img && typeof img === "string") {
    img = img.trim();
    if (img && !img.startsWith("http://") && !img.startsWith("https://")) {
      throw new Error("INVALID_IMG_URL");
    }
  }

  return await create({ title, img: img || null });
}

export async function updateMap(id, mapData) {
  const existingMap = await findById(id);
  if (!existingMap) {
    throw new Error("MAP_NOT_FOUND");
  }

  if (mapData.title) {
    const existingByTitle = await findByTitle(mapData.title);
    if (existingByTitle && existingByTitle.id !== Number(id)) {
      throw new Error("MAP_TITLE_ALREADY_EXISTS");
    }
  }

  if (mapData.img && typeof mapData.img === "string") {
    mapData.img = mapData.img.trim();
    if (mapData.img && !mapData.img.startsWith("http://") && !mapData.img.startsWith("https://")) {
      throw new Error("INVALID_IMG_URL");
    }
  }

  return await update(id, mapData);
}

export async function deleteMap(id) {
  const existingMap = await findById(id);
  if (!existingMap) {
    throw new Error("MAP_NOT_FOUND");
  }

  return await remove(id);
}
