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
                    <div
                      x-data="{ 
                      open: false,
                      itemId: ${category.id},
                      async deleteItem() {
                        try {
                          const res = await fetch('/categories/'+this.itemId, {
                            method: 'delete',
                          })
                          if(res.ok) {
                            window.location = window.location;
                          }
                        } catch(err) {
                          console.error(err)
                        }
                      }
                    }"
                      class="ml-auto relative"
                    >
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
                        @click.prevent
                        class="absolute top-full right-0 rounded-md p-2 shadow-lg bg-white ring-1 ring-gray-950/5 z-10"
                      >
                        <button
                          @click.prevent="deleteItem"
                          class="flex items-center gap-1 text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-4 h-4"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
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
