import { dbData } from "../utils/db.js";

const maps = dbData.maps
  .filter(
    (map) =>
      map &&
      typeof map.id !== "undefined" &&
      typeof map.title === "string"
  )
  .map((map) => ({
    id: Number(map.id) || 0,
    title: map.title?.trim() || "",
    img: typeof map.img === "string" ? map.img : null
  }));

let nextId = maps.length > 0 ? Math.max(...maps.map((map) => map.id)) + 1 : 1;

export function findAll() {
  return maps;
}

export function findById(id) {
  return maps.find((map) => map.id === id) || null;
}

export function findByTitle(title) {
  const normalized = title.trim().toLowerCase();
  return maps.find((map) => map.title.toLowerCase() === normalized) || null;
}

export function addMap({ title, img }) {
  const newMap = {
    id: nextId++,
    title: title.trim(),
    img: img || null
  };
  maps.push(newMap);
  return newMap;
}
