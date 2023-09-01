import { ServeOptions } from "bun";
import { router } from "./app/app.jsx";

export default {
  fetch(request) {
    const url = new URL(request.url);
    const context = { url };
    return router.handle(request, context);
  },
  port: 4321,
} as ServeOptions;
