import { RouterType, html } from "itty-router";
import { getUserCategories } from "../db/categoryService.js";
import { redirect } from "../utils/redirect.js";
import { renderView } from "../utils/renderView.js";
import { CategoryEditPage } from "../views/CategoryEditPage.js";

export function registerCategoryRoutes(router: RouterType) {
  router.get("/categories/new", (request, context) => {
    return html(CategoryEditPage({ currentUser: context.user }));
  });

  router.post("/categories/new", (request, context) => {
    return html(CategoryEditPage({ currentUser: context.user }));
  });
}
