import { ServeOptions } from "bun";
import { router } from "./app/app.jsx";

export default {
  fetch(request) {
    return router.handler(request);
  },
  port: 4321,
} as ServeOptions;
