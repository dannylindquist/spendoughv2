import { db } from "./db.js";

type DBCategory = {
  id: number;
  name: string;
  user: number;
  created_at: number;
  updated_at: number;
};

export function createCategory(userId: number, name: string) {
  return db
    .prepare<DBCategory, [number, string]>(
      "INSERT INTO user_category(user, name) values(?,?) returning *"
    )
    .get(userId, name);
}

export function getUserCategories(userId: number) {
  return db
    .prepare<DBCategory[], number>("SELECT * from user_category where user = ?")
    .all(userId);
}
