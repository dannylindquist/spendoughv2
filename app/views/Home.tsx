import { DBTransactionSelect } from "../db/transactionService.js";
import { User } from "../db/userService.js";
import { TransactionList } from "./components/TransactionList.jsx";
import { MainLayout } from "./layout.jsx";

export type HomeProps = {
  currentUser: User;
  monthKey: number;
  transactions: DBTransactionSelect[];
};

export const HomeView = ({
  monthKey,
  transactions,
  currentUser,
}: HomeProps) => {
  const keyString = monthKey.toString();
  const year = keyString.substring(0, 4);
  const month = keyString.substring(4, 6);
  const date = new Date(`${year}-${month}-01T00:00:00`);
  const total = transactions.reduce(
    (agg, transaction) => agg + transaction.amount,
    0
  );
  return (
    <MainLayout currentUser={currentUser}>
      <div class="text-center mt-8">
        {total / 100}
        <h2 class="text-3xl font-black">
          {date.toLocaleDateString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
      </div>
      <a
        href={`/transactions/new?month_key=${monthKey}`}
        class="border rounded-lg p-2 bg-gray-50 block w-fit mx-auto"
      >
        New Transaction
      </a>
      {transactions.length === 0 ? (
        <div>
          <p>No transactions for this month! Good job not spending money!</p>
          <a href={`/transactions/new?month_key=${monthKey}`}>
            Create Transaction
          </a>
        </div>
      ) : (
        <TransactionList transactions={transactions} />
      )}
    </MainLayout>
  );
};
