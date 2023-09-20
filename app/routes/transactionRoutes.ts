import { html, json, RouterType } from "itty-router";
import { getUserCategories } from "../db/categoryService.js";
import {
  createTransaction,
  deleteTransactionById,
  getTransactionById,
  TransactionInsert,
  transactionSchema,
  TransactionUpdate,
  updateTransaction,
} from "../db/transactionService.js";
import { redirect } from "../utils/redirect.js";
import { TransactionEditPage } from "../views/TransactionEditPage.js";

export function registerTransactionRoutes(router: RouterType) {
  router.get("/transactions/new", (request, context) => {
    const user = context.user;
    const monthKey = +request.params.monthKey;
    const categories = getUserCategories(user.id);
    return html(
      TransactionEditPage({
        categories,
        currentUser: user,
      })
    );
  });

  router.get("/transactions/:transactionId/edit", (request, context) => {
    const transactionId = +request.params.transactionId;
    const user = context.user;
    const transaction = getTransactionById(user.id, transactionId);
    if (transaction) {
      const categories = getUserCategories(user.id);
      return html(
        TransactionEditPage({
          transaction,
          categories,
          currentUser: user,
        })
      );
    }
  });

  router.delete("/transactions/:transactionId", (request, context) => {
    const useJson = request.headers.get("accept") === "application/json";
    const searchParams = context.url.searchParams as URLSearchParams;
    console.log(searchParams, searchParams.get("month_key"));
    const transactionId = +request.params.transactionId;
    const user = context.user;
    const transaction = deleteTransactionById(user.id, transactionId);
    if (transaction) {
      return useJson
        ? json({ message: "success" })
        : redirect(`/${searchParams.get("month_key") ?? ""}`);
    }
    return json(
      { message: "failure" },
      {
        status: 404,
      }
    );
  });

  router.post("/transactions/:transactionId/edit", async (request, context) => {
    const transactionId = +request.params.transactionId;
    const user = context.user;
    const formData = await request.formData();
    const formObject = Object.fromEntries(formData.entries());
    const transaction = transactionSchema.safeParse(formObject);
    if (transaction.success) {
      const date = new Date(transaction.data.date);
      const toUpdate: TransactionUpdate = {
        id: transactionId,
        amount: Math.floor(transaction.data.amount * 100),
        user: user.id,
        category: transaction.data.category,
        date: Math.floor(date.getTime() / 1000),
        description: transaction.data.description,
        notes: transaction.data?.notes?.trim(),
        is_withdrawal: 1,
        month_key: +`${date.getUTCFullYear()}${(date.getUTCMonth() + 1)
          .toString()
          .padStart(2, "0")}`,
      };
      const newTransaction = updateTransaction(toUpdate);
      if (newTransaction) {
        const route = context.url.searchParams.has("month_key")
          ? `/${context.url.searchParams.get("month_key")}`
          : "/";
        return new Response(null, {
          status: 302,
          headers: {
            Location: route,
          },
        });
      }
      return redirect("/", 302);
    }
  });

  router.post("/transactions/new", async (request, context) => {
    const user = context.user;
    const formData = await request.formData();
    const formObject = Object.fromEntries(formData.entries());
    const transaction = transactionSchema.safeParse(formObject);
    if (transaction.success) {
      const date = new Date(transaction.data.date);
      const toInsert: TransactionInsert = {
        amount: Math.floor(transaction.data.amount * 100),
        user: user.id,
        category: transaction.data.category,
        date: Math.floor(date.getTime() / 1000),
        description: transaction.data.description,
        notes: transaction.data?.notes?.trim(),
        is_withdrawal: 1,
        month_key: +`${date.getUTCFullYear()}${(date.getUTCMonth() + 1)
          .toString()
          .padStart(2, "0")}`,
      };
      const newTransaction = createTransaction(toInsert);
      return redirect("/", 302);
    }
    return new Response(JSON.stringify(transaction.error));
  });
}
