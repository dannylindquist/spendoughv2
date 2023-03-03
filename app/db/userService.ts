import { db } from "./db.js";
import bcrypt from "bcryptjs";
import { THIRTY_DAYS_IN_SECONDS } from "../utils/constants.js";

export type User = {
  id: number;
  email: string;
};

type DBUser = User & {
  password: string;
};

export type Session = {
  id: number;
  expires_at: number;
};

export const createUser = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const normalizedEmail = email.toLowerCase();
    const passwordHashed = await bcrypt.hash(password, 10);
    const user = db
      .prepare<User, [string, string]>(
        "insert into user(email, password) values (?, ?) returning id, email"
      )
      .get(normalizedEmail, passwordHashed);
    return user;
  } catch {
    return null;
  }
};

export const validateLogin = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const normalizedEmail = email.toLowerCase();
    const user = db
      .prepare<DBUser, [string]>("select * from user where email = ?")
      .get(normalizedEmail);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const createSession = (user: User): Session | undefined | null => {
  try {
    const session = db
      .prepare<Session, [number, number]>(
        "insert into user_session(user, expires_at) values(?,?) returning id,expires_at"
      )
      .get(user.id, Math.floor(Date.now() / 1000) + THIRTY_DAYS_IN_SECONDS);
    return session;
  } catch (error) {
    console.error(error);
  }
  return null;
};

export const getUserFromSession = (
  sessionId: number
): User | undefined | null => {
  try {
    const user = db
      .prepare<DBUser, [number]>(
        "SELECT id, email FROM user where id = (select user from user_session where id = ?)"
      )
      .get(sessionId);
    return user;
  } catch (error) {
    console.error(error);
  }
  return null;
};
