import { db } from "./db.js";
import { z } from "zod";

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

export type DBTransactionSelect = DBTransaction & {
  categoryText: string;
};

export const transactionSchema = z.object({
  amount: z.coerce.number(),
  description: z.string(),
  date: z.string(),
  category: z.coerce.number(),
});

export function getTransactions(
  userId: number,
  monthKey: number
): DBTransactionSelect[] {
  return db
    .prepare<DBTransactionSelect, [number, number]>(
      "SELECT t.*, c.name as categoryText from user_transaction t join user_category c on t.category = c.id where t.month_key = ? and t.user = ? order by t.date desc"
    )
    .all(monthKey, userId);
}

export function getTransactionById(
  userId: number,
  transactionId: number
): DBTransactionSelect | null {
  return db
    .prepare<DBTransactionSelect, [number, number]>(
      "SELECT t.*, c.name as categoryText from user_transaction t join user_category c on t.category = c.id where t.id = ? and t.user = ?"
    )
    .get(transactionId, userId);
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

export type TransactionUpdate = TransactionInsert & {
  id: number;
};

export function updateTransaction(transaction: TransactionUpdate) {
  return db
    .prepare<
      DBTransaction,
      {
        $id: number;
        $amount: number;
        $description: string;
        $category: number;
        $user: number;
        $month_key: number;
        $date: number;
      }
    >(
      `
        UPDATE 
          user_transaction set 
            amount=$amount,
            description=$description,
            category=$category,
            month_key=$month_key,
            date=$date,
            updated_at=strftime('%s')
        where 
          id=$id 
            and 
          user=$user
        returning *
      `
    )
    .get({
      $id: transaction.id,
      $amount: transaction.amount,
      $description: transaction.description,
      $category: transaction.category,
      $user: transaction.user,
      $month_key: transaction.month_key,
      $date: transaction.date,
    });
}

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
      $date: transaction.date,
    });
}
