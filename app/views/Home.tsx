import { DBTransaction } from "../db/transactionService.js";
import { MainLayout } from "./layout.jsx";

export type HomeProps = {
  monthKey: number;
  transactions: DBTransaction[];
};

export const HomeView = ({ monthKey, transactions }: HomeProps) => {
  const keyString = monthKey.toString();
  const year = keyString.substring(0, 4);
  const month = keyString.substring(4, 6);
  const date = new Date(`${year}-${month}-01T00:00:00`);
  return (
    <MainLayout>
      <h2>
        {date.toLocaleDateString("default", {
          month: "long",
          year: "numeric",
        })}
      </h2>
      <form action="/logout" method="post">
        <button type="submit">Logout</button>
      </form>
      {transactions.length === 0 && (
        <div>
          <p>No transactions for this month! Good job not spending money!</p>
          <a href={`/transactions/new?month_key=${monthKey}`}>
            Create Transaction
          </a>
        </div>
      )}
    </MainLayout>
  );
};
