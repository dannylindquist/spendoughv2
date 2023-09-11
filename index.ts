import { ServeOptions } from "bun";
import { router } from "./app/app.jsx";
import { runWatcher } from "./app/utils/buildAssets.js";

if (process.env.NODE_ENV !== "production") {
  runWatcher();
  Bun.spawn(["bun", "build:css"], {
    stdout: "inherit",
  });
}

export default {
  fetch(request) {
    const url = new URL(request.url);
    const context = { url };
    return router.handle(request, context);
  },
  port: 4321,
} as ServeOptions;
