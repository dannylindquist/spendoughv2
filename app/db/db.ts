import { Database } from "bun:sqlite";

// @ts-expect-error not typing globalThis
const db: Database = (globalThis["db"] ??= new Database("./data.sqlite"));

db.exec("pragma JOURNAL_MODE=wal");
db.exec("pragma FOREIGN_KEYS=on");

export { db };
