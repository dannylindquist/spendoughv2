import Database from "bun:sqlite";
const sql = String.raw;

export function up(db: Database) {
  db.run(
    sql`CREATE TABLE user(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email_validated INTEGER not null default 0,

      created_at INTEGER NOT NULL default (strftime('%s')),
      updated_at INTEGER NOT NULL default (strftime('%s'))
    )`
  );

  db.run(
    sql`CREATE TABLE user_session(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user INTEGER NOT NULL,
        expires_at INTEGER NOT NULL,

        created_at INTEGER NOT NULL default (strftime('%s')),
        updated_at INTEGER NOT NULL default (strftime('%s')),

        FOREIGN KEY(user) REFERENCES user(id)
      )`
  );

  db.run(
    sql`CREATE INDEX IF NOT EXISTS fk_session_user on user_session(user);`
  );

  db.run(
    sql`CREATE TABLE user_transaction(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount INTEGER NOT NULL,
        description TEXT NOT NULL,
        category INTEGER NOT NULL,
        user INTEGER NOT NULL,
        is_withdrawal INTEGER NOT NULL default 1,
        month_key INTEGER NOT NULL,
        date INTEGER NOT NULL,

        created_at INTEGER NOT NULL default (strftime('%s')),
        updated_at INTEGER NOT NULL default (strftime('%s')),

        FOREIGN KEY(user) REFERENCES user(id),
        FOREIGN KEY(category) REFERENCES user_category(id)
      )`
  );

  db.run(
    sql`CREATE INDEX IF NOT EXISTS fk_transaction_user on user_transaction(user);`
  );
  db.run(
    sql`CREATE INDEX IF NOT EXISTS fk_transaction_category on user_transaction(category);`
  );
  db.run(
    sql`CREATE INDEX IF NOT EXISTS idx_transaction_monthKey on user_transaction(month_key);`
  );

  db.run(
    sql`CREATE TABLE user_category(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        user INTEGER NOT NULL,

        created_at INTEGER NOT NULL default (strftime('%s')),
        updated_at INTEGER NOT NULL default (strftime('%s')),

        FOREIGN KEY(user) REFERENCES user(id)
      )`
  );
  db.run(
    sql`CREATE INDEX IF NOT EXISTS fk_category_user on user_category(user);`
  );
}
