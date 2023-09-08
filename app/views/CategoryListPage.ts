import { User } from "../db/userService.js";
import { DBCategory } from "../db/categoryService.js";
import { MainLayout } from "./layout.js";
import { html } from "../utils/html.js";

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
      <div class="max-w-lg mx-auto px-2">
        ${categories.map((category) => html` <div>${category.name}</div> `)}
      </div>
    `,
  });
};
