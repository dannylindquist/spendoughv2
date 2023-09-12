import { DBCategory } from "../db/categoryService.js";
import { DBTransaction } from "../db/transactionService.js";
import { MainLayout } from "./layout.js";
import { User } from "../db/userService.js";
import { html } from "../utils/html.js";
import sanitize from "sanitize-html";

export type TransactionEditPageProps = {
  currentUser: User;
  transaction?: DBTransaction;
  categories: DBCategory[];
};

export function TransactionEditPage({
  transaction,
  categories,
  currentUser,
}: TransactionEditPageProps) {
  const isEditing = transaction !== undefined;
  const date = isEditing ? new Date(transaction.date * 1000) : new Date();
  const todayStr = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;

  return MainLayout({
    currentUser,
    children: html`
      <div class="max-w-sm mx-auto px-2 pt-12">
        <h2 class="text-4xl font-black py-4 text-center">
          ${isEditing ? "Edit Transaction" : "Create Transaction"}
        </h2>
        <form
          x-data="{ 
            isEditing: ${isEditing}, 
            toDateString() {
              const date = new Date();
              return date.getFullYear()+'-'+(date.getMonth() + 1).toString()
    .padStart(2, '0')+'-'+date.getDate().toString().padStart(2, '0');
            }
          }"
          x-init="if(!isEditing) $refs.date.value = toDateString()"
          method="post"
          class="flex flex-col gap-4 px-4 py-6 rounded-xl"
        >
          <div class="space-y-1">
            <label class="block" for="description">Description:</label>
            <input
              class="px-2 py-2 border block w-full rounded bg-gray-50 ring-2 ring-gray-950/5 appearance-none focus:ring-yellow-500 focus:outline-none"
              required
              ${transaction?.description
                ? `value="${sanitize(transaction.description)}"`
                : ""}
              type="text"
              name="description"
              id="description"
            />
          </div>
          <div class="space-y-1">
            <label class="block" for="notes">Notes:</label>
            <textarea
              class="px-2 py-2 border block w-full rounded bg-gray-50 ring-2 ring-gray-950/5 appearance-none focus:ring-yellow-500 focus:outline-none"
              name="notes"
              id="notes"
            >${sanitize(transaction?.notes ?? "")}</textarea>
          </div>
          <div class="space-y-1">
            <label class="block" for="amount"> Amount: </label>
            <input
              class="px-2 py-2 border block w-full rounded bg-gray-50 ring-2 ring-gray-950/5 appearance-none focus:ring-yellow-500 focus:outline-none"
              inputmode="decimal"
              required
              value=${isEditing ? transaction.amount / 100 : undefined}
              type="number"
              name="amount"
              id="amount"
              step="0.01"
            />
          </div>
          <div class="space-y-1">
            <label class="block" for="date"> Date: </label>
            <input
              x-ref="date"
              class="px-2 py-2 border block w-full appearance-none rounded bg-gray-50 ring-2 ring-gray-950/5 focus:ring-yellow-500 focus:outline-none"
              required
              type="date"
              name="date"
              id="date"
              value=${isEditing ? todayStr : undefined}
            />
          </div>
          <div class="space-y-1">
            <label class="block" for="date">Category: </label>
            <div class="flex gap-2 flex-wrap">
              ${categories
                .map(
                  (category) => html`
                    <div>
                      <input
                        ${category.id === transaction?.category
                          ? "checked"
                          : ""}
                        class="sr-only peer"
                        required
                        type="radio"
                        value=${category.id}
                        name="category"
                        id=${`category-${category.id}`}
                      />
                      <label
                        class="block px-4 py-2 bg-white peer-checked:ring-2 peer-checked:ring-yellow-500 rounded whitespace-nowrap min-w-[5rem] text-center ring-2 ring-gray-950/5"
                        for=${`category-${category.id}`}
                      >
                        ${category.name}
                      </label>
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
          <button
            class="block p-2 font-medium rounded bg-gray-50 ring-2 ring-gray-950/5 focus:outline-none appearance-none"
            type="submit"
          >
            ${isEditing ? "Update" : "Create"}
          </button>
        </form>
      </div>
    `,
  });
}
