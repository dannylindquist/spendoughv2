import { readdirSync } from "node:fs";
import { db } from "./app/db/db.js";

const migrationsFolder = "./migrations";
const migrations = readdirSync(migrationsFolder).sort();

const tables = db
  .prepare<{ name: string }, []>(
    `select name from sqlite_master where type = 'table'`
  )
  .all();

const hasMigrationsTable = tables.find((table) => table.name === "migrations");

if (!hasMigrationsTable) {
  db.run(
    `CREATE TABLE migrations(
      filename TEXT NOT NULL PRIMARY KEY
    )`
  );
}

const migrationsRun = db
  .prepare<{ filename: string }, []>("select * from migrations")
  .all();

for (const migration of migrations) {
  if (migrationsRun.find((run) => run.filename === migration)) {
    continue;
  }
  const filePath = `${migrationsFolder}/${migration}`;
  const moduleContents = await import(filePath);
  if (typeof moduleContents.up === "function") {
    try {
      moduleContents.up(db);
      db.prepare(`insert into migrations(filename) values(?)`).run(migration);
    } catch (e) {
      console.error("Failed migration: " + migration);
      console.error(e);
      // don't continue migrations
      break;
    }
  }
}
