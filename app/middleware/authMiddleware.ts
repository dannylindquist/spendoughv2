import { RouteHandler } from "itty-router";

export const authMiddleware: RouteHandler = async (request, context) => {
  console.log(context);
  if (!context.user) {
    return new Response("Invalid Session", {
      status: 302,
      headers: {
        Location: "/login",
        "Set-Cookie": "token=;Max-Age=0;HttpOnly;",
      },
    });
  }
};
