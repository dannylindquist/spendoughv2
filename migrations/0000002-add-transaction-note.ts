import Database from "bun:sqlite";

export function up(db: Database) {
  db.run("ALTER TABLE user_transaction ADD COLUMN notes");
}
