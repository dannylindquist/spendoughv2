import { getUserCategories } from "../db/categoryService.js";
import { Router } from "../router.js";
import { renderView } from "../utils/renderView.js";
import { TransactionEditPage } from "../views/TransactionEditPage.jsx";

export function registerTransactionRoutes(router: Router) {
  router.get("/transactions/new", (request, context) => {
    const user = context.props.get("user");
    const monthKey = +context.params.monthKey;
    const categories = getUserCategories(user.id);
    return renderView(<TransactionEditPage categories={categories} />);
  });

  router.post("/transactions/new", async (request, context) => {
    const user = context.props.get("user");
    const formData = await request.formData();
    const description = formData.get("description");
    const amount = formData.get("amount");
    const data = Object.fromEntries(formData.entries());
    return new Response(JSON.stringify(data));
  });
}
