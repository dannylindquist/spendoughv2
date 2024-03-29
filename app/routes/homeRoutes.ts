import { getUserCategories } from "../db/categoryService.js";
import { getTransactions } from "../db/transactionService.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { RouterType, html } from "itty-router";
import { redirect } from "../utils/redirect.js";
import { HomeView } from "../views/Home.jsx";

export const registerHomeRoutes = (router: RouterType) => {
  router.get("/", authMiddleware, function () {
    const date = new Date();
    const monthKey =
      date.getUTCFullYear() +
      (date.getUTCMonth() + 1).toString().padStart(2, "0");
    return redirect(`/${monthKey}`);
  });

  router.get("/:monthKey", authMiddleware, (request, context) => {
    const monthKey = +request.params.monthKey;
    const user = context.user;
    if (!user) {
      return new Response("invalid session", {
        status: 302,
        headers: {
          Location: "/login",
          "Set-Cookie": "token=;Max-Age=0;HttpOnly;",
        },
      });
    }

    const transactions = getTransactions(user.id, monthKey);
    return html(
      HomeView({
        monthKey,
        transactions,
        currentUser: user,
      })
    );
  });
};
