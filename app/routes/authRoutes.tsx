import { parse } from "cookie";
import { createDefaultCategories } from "../db/categoryService.js";
import { createSession, createUser, validateLogin } from "../db/userService.js";
import { RouterType } from "itty-router";
import { redirect } from "../utils/redirect.js";
import { renderView } from "../utils/renderView.js";
import { writeSession } from "../utils/sessionUtils.js";
import { LoginView } from "../views/Login.jsx";
import { SignupView } from "../views/Signup.jsx";

export const registerAuthRoutes = (router: RouterType) => {
  router.post("/logout", () => {
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
        "Set-Cookie": "token=;Max-Age=0;HttpOnly;SameSite=lax",
      },
    });
  });

  router.get("/login", (request, context) => {
    if (context.sessionId) {
      return redirect("/");
    }
    const error = parse(request.headers.get("cookie") ?? "")?.error;
    return renderView(<LoginView error={error} />, {
      "set-cookie": "error=;Max-Age=0;HttpOnly;",
    });
  });

  router.post("/login", async (response) => {
    const formData = await response.formData();
    const email = formData.get("email");
    const password = formData.get("password");
    if (typeof email !== "string" || typeof password !== "string") {
      return new Response("Bad data", {
        status: 302,
        headers: {
          Location: "/login",
          "Set-Cookie": "error=Missing required fields;HttpOnly;",
        },
      });
    }
    const user = await validateLogin(email, password);
    console.log(user);
    if (user) {
      const session = createSession(user);
      if (session) {
        return new Response("Success", {
          status: 302,
          headers: {
            Location: "/",
            "Set-Cookie": await writeSession(session),
          },
        });
      }
    }
    return new Response("Failure", {
      status: 302,
      headers: {
        Location: "/login",
        "Set-Cookie": "error=Failed to log in;HttpOnly;",
      },
    });
  });

  router.get("/signup", (request, context) => {
    if (context.sessionId) {
      return redirect("/");
    }
    const error = parse(request.headers.get("cookie") ?? "")?.error;
    return renderView(<SignupView error={error} />, {
      "set-cookie": "error=;Max-Age=0;HttpOnly;",
    });
  });

  router.post("/signup", async (request, context) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("password-confirm");
    if (password && passwordConfirm && password !== passwordConfirm) {
      return new Response("Passwords do not match", {
        status: 302,
        headers: {
          Location: "/signup",
          "set-cookie": `error=Passwords don't match;HttpOnly;`,
        },
      });
    }
    const user = await createUser(email, password);
    if (user != null) {
      createDefaultCategories(user?.id);
      const session = createSession(user);
      if (session) {
        return new Response("Success", {
          status: 302,
          headers: {
            Location: "/",
            "Set-Cookie": await writeSession(session),
          },
        });
      } else {
        return new Response("Success", {
          status: 302,
          headers: {
            Location: "/signup",
            "Set-Cookie": "error=Something went wrong.;HttpOnly;",
          },
        });
      }
    } else {
      return new Response("Email in use", {
        status: 302,
        headers: {
          Location: "/signup",
          "set-cookie": `error=Email is already in use.;HttpOnly;`,
        },
      });
    }
  });
};
