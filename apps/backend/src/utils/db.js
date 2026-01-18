import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = resolve(__dirname, "../../../../db.json");

let dbData;
try {
  dbData = JSON.parse(readFileSync(dbPath, "utf-8"));
} catch (error) {
  throw new Error(`Failed to load db.json from ${dbPath}: ${error.message}`);
}

export { dbData };

