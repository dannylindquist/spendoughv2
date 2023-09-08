import { RouterType, html } from "itty-router";
import { getUserCategories } from "../db/categoryService.js";
import { redirect } from "../utils/redirect.js";
import { CategoryEditPage } from "../views/CategoryEditPage.js";
import { CategoryListPage } from "../views/CategoryListPage.js";

export function registerCategoryRoutes(router: RouterType) {
  router.get("/categories", async (request, context) => {
    const categories = getUserCategories(context.user.id);
    return html(CategoryListPage({ currentUser: context.user, categories }));
  });

  router.get("/categories/new", (request, context) => {
    return html(CategoryEditPage({ currentUser: context.user }));
  });

  router.post("/categories/new", (request, context) => {
    return html(CategoryEditPage({ currentUser: context.user }));
  });
}
