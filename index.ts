import { ServeOptions } from "bun";
import { router } from "./app/app.jsx";
import { runWatcher } from "./app/utils/buildAssets.js";

runWatcher();

console.log("reloading", new Date());

export default {
  fetch(request) {
    const url = new URL(request.url);
    const context = { url };
    return router.handle(request, context);
  },
  port: 4321,
} as ServeOptions;
