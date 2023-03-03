import { Handler } from "../router.js";

export const authMiddleware: Handler = async (request, context) => {
  if (!context.props.has("user")) {
    return new Response("Invalid Session", {
      status: 302,
      headers: {
        Location: "/login",
        "Set-Cookie": "token=;Max-Age=0;HttpOnly;",
      },
    });
  }
};
