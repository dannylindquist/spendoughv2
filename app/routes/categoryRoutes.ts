import { RouterType, html, json } from "itty-router";
import {
  createCategory,
  updateCategory,
  getUserCategories,
  getUserCategoryById,
  isCategoryNameUnique,
  deleteCategory,
} from "../db/categoryService.js";
import { redirect } from "../utils/redirect.js";
import { CategoryEditPage } from "../views/CategoryEditPage.js";
import { CategoryListPage } from "../views/CategoryListPage.js";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().nonempty(),
});

export function registerCategoryRoutes(router: RouterType) {
  router.get("/categories", async (request, context) => {
    const categories = getUserCategories(context.user.id);
    return html(CategoryListPage({ currentUser: context.user, categories }));
  });

  router.get("/categories/:categoryId/edit", (request, context) => {
    const category =
      getUserCategoryById(context.user.id, +request.params.categoryId) ??
      undefined;
    return html(CategoryEditPage({ currentUser: context.user, category }));
  });

  router.delete("/categories/:categoryId", async (request, context) => {
    const categoryId = +request.params.categoryId;
    const userId = context.user.id;
    const removedCategory = deleteCategory(userId, categoryId);
    console.log(removedCategory);
    if (removedCategory) {
      return json({ message: "success" });
    }
    return json({ message: "failure" }, { status: 404 });
  });

  router.post("/categories/:categoryId/edit", async (request, context) => {
    const useJson = request.headers.get("accept") === "application/json";
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    const valid = categorySchema.safeParse(data);
    if (valid.success && valid.data.name.trim().length > 0) {
      if (
        !isCategoryNameUnique(
          context.user.id,
          valid.data.name,
          +request.params.categoryId
        )
      ) {
        return json(
          {
            message: "Category already exists",
          },
          { status: 400 }
        );
      }
      const updatedCategory = updateCategory(
        context.user.id,
        +request.params.categoryId,
        valid.data.name
      );
      if (updatedCategory) {
        if (useJson) {
          return json({
            message: "success",
            category: updatedCategory,
          });
        } else {
          return redirect("/categories", 302);
        }
      }
    }
    if (useJson) {
      return json(
        {
          message: "Verify that name is non empty",
        },
        { status: 400 }
      );
    }
  });

  router.get("/categories/new", (request, context) => {
    return html(CategoryEditPage({ currentUser: context.user }));
  });

  router.post("/categories/new", async (request, context) => {
    const useJson = request.headers.get("accept") === "application/json";
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    const valid = categorySchema.safeParse(data);
    if (valid.success && valid.data.name.trim().length > 0) {
      if (!isCategoryNameUnique(context.user.id, valid.data.name)) {
        return json(
          {
            message: "Category already exists",
          },
          { status: 400 }
        );
      }
      const newCategory = createCategory(context.user.id, valid.data.name);
      if (newCategory) {
        if (useJson) {
          return json({
            message: "success",
            category: newCategory,
          });
        } else {
          return redirect("/categories", 302);
        }
      }
    }
    if (useJson) {
      return json(
        {
          message: "Verify that name is non empty",
        },
        { status: 400 }
      );
    }
    return html(CategoryEditPage({ currentUser: context.user }));
  });
}
