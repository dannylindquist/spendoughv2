import Database from "bun:sqlite";
const sql = String.raw;

export function up(db: Database) {
  db.run(sql`
    CREATE TABLE user_payment_method(
      id INTEGER PRIMARy KEY AUTOINCREMENT,
      user INTEGER NOT NULL,
      name TEXT NOT NULL,

      created_at INTEGER NOT NULL default (strftime('%s')),
      updated_at INTEGER NOT NULL default (strftime('%s')),

      FOREIGN KEY(user) REFERENCES user(id) 
    )
  `);

  db.run(sql`
    ALTER TABLE user_transaction ADD COLUMN method INTEGER REFERENCES user_payment_method(id)
  `);
}
