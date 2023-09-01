import { getUserFromSession } from "../db/userService.js";
import { RouteHandler } from "itty-router";
import { parseSession } from "../utils/sessionUtils.js";

export const tokenParseMiddleWare: RouteHandler = async (request, context) => {
  if (!context.url.pathname.startsWith("/assets")) {
    const session = await parseSession(request);
    if (session && typeof session.sessionId === "number") {
      context.sessionId = session.sessionId;
      const user = getUserFromSession(session.sessionId);
      if (user) {
        context.user = user;
      }
    }
  }
};
