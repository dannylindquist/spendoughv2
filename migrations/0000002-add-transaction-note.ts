import Database from "bun:sqlite";
const sql = String.raw;

export function up(db: Database) {
  db.run(sql`ALTER TABLE user_transaction ADD COLUMN notes`);
}
