import fs from "fs";
import { readFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { Ajv } from "ajv";
import { databasePool } from "./db.js";
import { addUser } from "./utils/addUser.js";
import {
  type UserFile,
  sanitiseUserFile,
  userFileSchema,
} from "./utils/schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const initialiseSchemaScript = fs.readFileSync(
  path.join(__dirname, "..", "database", "InitialSchema.sql"),
  "utf-8",
);

console.log("Initialising database schema");
await databasePool.query(initialiseSchemaScript);

const ajv = new Ajv({ allowUnionTypes: true });
const validate = ajv.compile(userFileSchema);

const dataDir = path.join(__dirname, "..", "data");
const fileNames = fs
  .readdirSync(dataDir)
  .filter((fileName) => fileName.endsWith(".json") && !fileName.startsWith("."))
  .slice(0, 10000);

const importFile = async (fileName: string) => {
  const filePath = path.join(dataDir, fileName);
  let data;
  try {
    data = JSON.parse(await readFile(filePath, "utf-8")) as unknown;
  } catch {
    try {
      // All the files with invalid json seem to only be missing the final `}`, so we try adding it to see if that makes it valid
      const invalidJson = fs.readFileSync(filePath, "utf-8");
      data = JSON.parse(`${invalidJson}}`) as unknown;
    } catch {
      // If adding a closing curly brace still doesn't fix the file, then ignore it and move on
      throw new Error(`Failed to parse JSON: ${filePath}`);
    }
  }

  if (validate(data)) {
    const user = data as UserFile;
    await addUser(sanitiseUserFile(fileName, user));
  } else {
    const errors = validate.errors;
    console.error(`${fileName}:`);
    if (errors) {
      for (const err of errors) {
        console.error(`  ${err.instancePath} ${err.message ?? ""}`);
      }
    }
    throw new Error(`Failed to validate JSON: ${fileName}`);
  }
};

console.log("Importing files to the database");
console.time("import");

for (const fileName of fileNames) {
  try {
    await importFile(fileName);
  } catch (e) {
    console.error(e);
  }
}

console.log(
  `Finished importing ${fileNames.length.toLocaleString()} JSON files to the database.`,
);
console.timeEnd("import");
