import { Database } from "bun:sqlite";

const path = (process.env.mountDir || ".") + "/data.sqlite";
// @ts-expect-error not typing globalThis
const db: Database = (globalThis["db"] ??= new Database(path));

db.exec("pragma JOURNAL_MODE=wal");
db.exec("pragma FOREIGN_KEYS=on");

export { db };
