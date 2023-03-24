import { DBTransactionSelect } from "../../db/transactionService.js";
import { Fragment } from "preact";

const moneyFormatter = new Intl.NumberFormat("default", {
  style: "currency",
  currency: "USD",
});

function hash(content: string) {
  let result = 0;
  for (let i = 0; i < content.length; i++) {
    let char = content.charCodeAt(i);
    result = (result << 5) - result + char;
    result = result & result; // Convert to 32bit integer
  }
  return result % 360;
}

function secondsToPrettyString(seconds: number) {
  const date = new Date(+seconds * 1000);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    weekday: "short",
    timeZone: "UTC",
  });
}

export function TransactionList({
  transactions,
}: {
  transactions: DBTransactionSelect[];
}) {
  const groups = transactions.reduce((agg, item) => {
    const d = item.date.toString();
    if (agg[d]) {
      agg[d].push(item);
    } else {
      agg[d] = [item];
    }
    return agg;
  }, {} as Record<string, DBTransactionSelect[]>);

  return (
    <div class="max-w-sm mx-auto px-2">
      {Object.keys(groups)
        .sort((a, b) => (+a > +b ? -1 : 1))
        .map((date) => (
          <div>
            <div class="text-gray-700 text-sm font-semibold py-3 pb-2">
              {secondsToPrettyString(+date)}
            </div>
            <div class="rounded-2xl bg-gray-50 px-4 py-2 border border-gray-300">
              {groups[date].map((transaction, index) => (
                <Fragment>
                  <a
                    href={`/transactions/${transaction.id}/edit?month_key=${transaction.month_key}`}
                    class="flex items-center py-2"
                  >
                    <div class="">
                      {transaction.description}
                      <div class="text-xs flex items-center gap-1">
                        <svg
                          class="h-2 w-2"
                          viewBox="0 0 100 100"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="50"
                            cy="50"
                            r="50"
                            fill={`hsl(${hash(
                              transaction.categoryText
                            )}deg 100% 60%)`}
                          />
                        </svg>
                        {transaction.categoryText}
                      </div>
                    </div>
                    <div class="ml-auto">
                      {moneyFormatter.format(transaction.amount / 100)}
                    </div>
                  </a>
                  {index !== groups[date].length - 1 && (
                    <div class="border-t border-t-gray-200 border-b border-b-white"></div>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
