import { User } from "../db/userService.js";
import { DBCategory } from "../db/categoryService.js";
import { MainLayout } from "./layout.js";
import { html } from "../utils/html.js";
import sanitize from "sanitize-html";

export type CategoryPageProps = {
  currentUser: User;
  categories: DBCategory[];
};

export const CategoryListPage = ({
  currentUser,
  categories,
}: CategoryPageProps) => {
  return MainLayout({
    currentUser,
    children: html`
      <div class="max-w-sm mx-auto px-2 pt-12">
        <h2 class="text-4xl font-black py-4 text-center">Categories</h2>
        <a
          class="ring-gray-950/5 ring-2 rounded-lg p-2 bg-gray-50 block w-fit mx-auto"
          href="/categories/new"
          >Create New</a
        >
        <div class="flex flex-col gap-2 pt-6">
          ${categories
            .map(
              (category) =>
                html`
                  <a
                    href="/categories/${category.id}/edit"
                    class="flex px-4 py-4 rounded-md bg-gray-50 ring-1 ring-gray-950/5"
                  >
                    ${sanitize(category.name)}
                    <div x-data="{ open: false }" class="ml-auto relative">
                      <button
                        type="button"
                        @click.prevent="open = true"
                        @click.outside="open = false"
                        class="-my-3 -mr-3 p-3"
                        aria-label="Category actions"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          class="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                          />
                        </svg>
                      </button>
                      <!-- dropdown -->
                      <div
                        x-show="open"
                        style="display: none;"
                        x-transition
                        class="absolute top-full right-0 rounded-md p-4 shadow-lg bg-white ring-1 ring-gray-950/5"
                      ></div>
                    </div>
                  </a>
                `
            )
            .join("")}
        </div>
      </div>
    `,
  });
};
