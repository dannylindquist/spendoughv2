import { parse, serialize } from "cookie";
import * as Jose from "jose";
import { Session } from "../db/userService.js";
import { ONE_YEAR_IN_SECONDS } from "./constants.js";

export const parseSession = async (request: Request) => {
  const cookies = parse(request.headers.get("cookie") || "");
  if (cookies.token) {
    const token = await Jose.jwtVerify(
      cookies.token,
      new TextEncoder().encode(Bun.env.COOKIE_SECRET as string)
    ).catch(() => undefined);
    console.log(token?.payload);
    return token?.payload;
  }
};

export const writeSession = async (session: Session) => {
  const token = await new Jose.SignJWT({
    sessionId: session.id,
    exp: session.expires_at,
  })
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(Bun.env.COOKIE_SECRET as string));
  const secondsTillExp = session.expires_at - Math.floor(Date.now() / 1000);
  return serialize("token", token, {
    maxAge: secondsTillExp,
    httpOnly: true,
    sameSite: "lax",
  });
};
