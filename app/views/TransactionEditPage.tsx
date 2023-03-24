import { DBCategory } from "../db/categoryService.js";
import { DBTransaction } from "../db/transactionService.js";
import { MainLayout } from "./layout.jsx";
import { Fragment } from "preact";
import { User } from "../db/userService.js";

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

  return (
    <MainLayout currentUser={currentUser}>
      <div class="max-w-sm mx-auto px-2 pt-12">
        <h2 class="text-4xl font-black py-4 text-center">
          {isEditing ? "Edit Transaction" : "Create Transaction"}
        </h2>
        <form
          method="post"
          class="flex flex-col gap-4 bg-gray-50 px-4 py-6 rounded-xl border border-gray-300"
        >
          <div class="space-y-1">
            <label class="block" htmlFor="description">
              Description:
            </label>
            <input
              class="px-2 py-2 border block w-full rounded"
              required
              value={isEditing ? transaction.description : undefined}
              type="text"
              name="description"
              id="description"
            />
          </div>
          <div class="space-y-1">
            <label class="block" htmlFor="amount">
              Amount:
            </label>
            <input
              class="px-2 py-2 border block w-full rounded"
              inputMode="decimal"
              required
              value={isEditing ? transaction.amount / 100 : undefined}
              type="number"
              name="amount"
              id="amount"
              step="0.01"
            />
          </div>
          <div class="space-y-1">
            <label class="block" htmlFor="date">
              Date:
            </label>
            <input
              class="px-2 py-2 border block w-full appearance-none rounded bg-white"
              required
              type="date"
              name="date"
              id="date"
              value={todayStr}
            />
          </div>
          <div class="space-y-1">
            <label class="block" htmlFor="date">
              Category:
            </label>
            <div class="flex gap-1 flex-wrap">
              {categories.map((category) => (
                <div>
                  <input
                    checked={category.id === transaction?.category}
                    class="sr-only peer"
                    required
                    type="radio"
                    value={category.id}
                    name="category"
                    id={`category-${category.id}`}
                  />
                  <label
                    class="block px-4 py-2 border bg-white peer-checked:border-green-500 rounded whitespace-nowrap min-w-[5rem] text-center"
                    htmlFor={`category-${category.id}`}
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
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
