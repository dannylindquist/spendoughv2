import { getUserCategories } from "../db/categoryService.js";
import { Router } from "../router.js";
import { redirect } from "../utils/redirect.js";
import { renderView } from "../utils/renderView.js";
import { CategoryEditPage } from "../views/CategoryEditPage.jsx";

export function registerCategoryRoutes(router: Router) {
  router.get("/categories/new", (request, context) => {
    return renderView(
      <CategoryEditPage currentUser={context.props.get("user")} />
    );
  });

  router.post("/categories/new", (request, context) => {
    return renderView(
      <CategoryEditPage currentUser={context.props.get("user")} />
    );
  });
}
