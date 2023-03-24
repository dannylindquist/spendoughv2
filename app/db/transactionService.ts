import { db } from "./db.js";

export type DBTransaction = {
  id: number;
  amount: number;
  description: string;
  category: number;
  user: number;
  is_withdrawal: number;
  month_key: number;
  date: number;
  created_at: number;
  updated_at: number;
};

export function getTransactions(
  userId: number,
  monthKey: number
): DBTransaction[] {
  return db
    .prepare<DBTransaction, [number, number]>(
      "SELECT * from user_transaction where month_key = ? and user = ?"
    )
    .all(monthKey, userId);
}

export type TransactionInsert = Pick<
  DBTransaction,
  | "amount"
  | "description"
  | "category"
  | "user"
  | "is_withdrawal"
  | "month_key"
  | "date"
>;

export function createTransaction(transaction: TransactionInsert) {
  return db
    .prepare<
      DBTransaction,
      {
        $amount: number;
        $description: string;
        $category: number;
        $user: number;
        $is_withdrawal: number;
        $month_key: number;
        $date: number;
      }
    >(
      `
        INSERT INTO 
        user_transaction(amount,description,category,user,is_withdrawal,month_key,date) 
        values($amount,$description,$category,$user,$is_withdrawal,$month_key,$date)
        returning *
      `
    )
    .get({
      $amount: transaction.amount,
      $description: transaction.description,
      $category: transaction.category,
      $user: transaction.user,
      $is_withdrawal: transaction.is_withdrawal,
      $month_key: transaction.month_key,
      $date: transaction.month_key,
    });
}
