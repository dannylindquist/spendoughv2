import { Router } from "./router.js";
import { registerAuthRoutes } from "./routes/authRoutes.js";
import { parseSession } from "./utils/sessionUtils.js";
import { existsSync } from "fs";
import { redirect } from "./utils/redirect.js";
import { registerHomeRoutes } from "./routes/homeRoutes.jsx";

export const router = new Router();

registerAuthRoutes(router);
registerHomeRoutes(router);

router.use(async (request, context) => {
  if (!context.url.pathname.startsWith("/static")) {
    const session = await parseSession(request);
    if (session) {
      context.props.set("sessionId", session.sessionId);
    }
  }
});

router.get("/assets/*", async (_, context) => {
  const asset: string = `./app${context.url.pathname}`;
  if (existsSync(asset)) {
    return new Response(Bun.file(asset));
  }
  return new Response("Not Found", {
    status: 404,
  });
});

router.get("/", function (_, context) {
  if (!context.props.has("sessionId")) {
    return redirect("/login");
  }
  const date = new Date();
  const monthKey =
    date.getUTCFullYear() +
    (date.getUTCMonth() + 1).toString().padStart(2, "0");
  return redirect(`/${monthKey}`);
});
