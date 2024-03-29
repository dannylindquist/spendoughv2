import { db } from "./db.js";

export type DBCategory = {
  id: number;
  name: string;
  user: number;
  created_at: number;
  updated_at: number;
};

export function createDefaultCategories(userId: number) {
  const insert = db.prepare(
    "INSERT INTO user_category (name, user) VALUES (?, ?)"
  );
  const insertCategories = db.transaction((categories) => {
    for (const category of categories) insert.run(category, userId);
    return categories.length;
  });

  insertCategories(["Utilities", "Groceries", "Eat Out", "Fun"]);
  db.prepare("SELECT * FROM user_category WHERE user = ?").all(userId);
}

export function isCategoryNameUnique(
  userId: number,
  categoryName: string,
  existingId?: number
) {
  if (existingId) {
    return (
      db
        .prepare(
          "select * from user_category where user = ? and name = ? and id != ? limit 1"
        )
        .get(userId, categoryName, existingId) === null
    );
  } else {
    return (
      db
        .prepare(
          "select * from user_category where user = ? and name = ? limit 1"
        )
        .get(userId, categoryName) === null
    );
  }
}

export function createCategory(userId: number, name: string) {
  return db
    .prepare<DBCategory, [number, string]>(
      "INSERT INTO user_category(user, name) values(?,?) returning *"
    )
    .get(userId, name);
}

export function updateCategory(
  userId: number,
  categoryId: number,
  name: string
) {
  return db
    .prepare<DBCategory, [string, number, number]>(
      "update user_category set name = ? where user = ? and id = ? returning *"
    )
    .get(name, userId, categoryId);
}

export function deleteCategory(userId: number, categoryId: number) {
  return db
    .prepare("delete from user_category where user = ? and id = ? returning *")
    .get(userId, categoryId);
}

export function getUserCategories(userId: number) {
  return db
    .prepare<DBCategory, number>("SELECT * from user_category where user = ?")
    .all(userId);
}

export function getUserCategoryById(userId: number, categoryId: number) {
  return db
    .prepare<DBCategory, [number, number]>(
      "SELECT * from user_category where user = ? and id = ?"
    )
    .get(userId, categoryId);
}
