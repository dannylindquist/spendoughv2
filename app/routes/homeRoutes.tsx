import { Router } from "../router.js";

export const registerHomeRoutes = (router: Router) => {
  router.get("/:monthKey", (request, context) => {
    return new Response(JSON.stringify(context.params), {
      headers: {
        "content-type": "application/json",
      },
    });
  });
};
