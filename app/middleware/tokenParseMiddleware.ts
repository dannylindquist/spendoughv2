import { getUserFromSession } from "../db/userService.js";
import { Handler } from "../router.js";
import { parseSession } from "../utils/sessionUtils.js";

export const tokenParseMiddleWare: Handler = async (request, context) => {
  if (!context.url.pathname.startsWith("/assets")) {
    const session = await parseSession(request);
    if (session && typeof session.sessionId === "number") {
      context.props.set("sessionId", session.sessionId);
      const user = getUserFromSession(session.sessionId);
      if (user) {
        context.props.set("user", user);
      }
    }
  }
};
