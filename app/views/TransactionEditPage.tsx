import { DBCategory } from "../db/categoryService.js";
import { DBTransaction } from "../db/transactionService.js";
import { MainLayout } from "./layout.jsx";

export type TransactionEditPageProps = {
  transaction?: DBTransaction;
  categories: DBCategory[];
};

export function TransactionEditPage({
  transaction,
  categories,
}: TransactionEditPageProps) {
  const isEditing = transaction !== undefined;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
  return (
    <MainLayout>
      <h2>{isEditing ? "Edit Transaction" : "Create Transaction"}</h2>
      <form action="/transactions/new" method="POST">
        <div>
          <label htmlFor="description">Description:</label>
          <input required type="text" name="description" id="description" />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input required type="number" name="amount" id="amount" step="0.01" />
        </div>
        <div>
          <label htmlFor="date">Date:</label>
          <input required type="date" name="date" id="date" value={todayStr} />
        </div>
        <div>
          <label htmlFor="date">Category:</label>
          {categories.map((category) => (
            <label style={{ display: "block" }}>
              {category.name}
              <input
                required
                type="radio"
                value={category.id}
                name="category"
              />
            </label>
          ))}
        </div>
        <button type="submit">Create</button>
      </form>
    </MainLayout>
  );
}
