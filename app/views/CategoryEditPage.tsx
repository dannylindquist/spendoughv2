import { DBCategory } from "../db/categoryService.js";
import { DBTransaction } from "../db/transactionService.js";
import { MainLayout } from "./layout.jsx";
import { Fragment } from "preact";
import { User } from "../db/userService.js";

export type CategoryEditPageProps = {
  category?: DBCategory;
  currentUser: User;
};

export function CategoryEditPage({
  category,
  currentUser,
}: CategoryEditPageProps) {
  const isEditing = category !== undefined;

  return (
    <MainLayout currentUser={currentUser}>
      <div class="max-w-sm mx-auto px-2">
        <h2 class="text-4xl font-black py-4 text-center">
          {isEditing ? "Edit Category" : "Create Category"}
        </h2>
        <form
          action="/categories/new"
          method="post"
          class="flex flex-col gap-4 bg-gray-50 px-4 py-6 rounded-xl border border-gray-300"
        >
          <div class="space-y-1">
            <label class="block" htmlFor="name">
              Name:
            </label>
            <input
              class="px-2 py-2 border block w-full rounded"
              required
              value={isEditing ? category.name : undefined}
              type="text"
              name="name"
              id="name"
            />
          </div>
          <button
            class="block border p-2 rounded bg-gray-800 text-gray-50"
            type="submit"
          >
            {isEditing ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
