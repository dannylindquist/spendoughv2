import { Router } from "itty-router";
import { registerAuthRoutes } from "./routes/authRoutes.js";
import { existsSync } from "fs";
import { registerHomeRoutes } from "./routes/homeRoutes.jsx";
import { tokenParseMiddleWare } from "./middleware/tokenParseMiddleware.js";
import { registerTransactionRoutes } from "./routes/transactionRoutes.jsx";
import { registerCategoryRoutes } from "./routes/categoryRoutes.jsx";

export const router = Router();

router.all("*", tokenParseMiddleWare);

registerAuthRoutes(router);
registerHomeRoutes(router);
registerTransactionRoutes(router);
registerCategoryRoutes(router);

router.get("/assets/*", async (_, context) => {
  const asset: string = `./app${context.url.pathname}`;
  if (existsSync(asset)) {
    return new Response(Bun.file(asset));
  }
  return new Response("Not Found", {
    status: 404,
  });
});
