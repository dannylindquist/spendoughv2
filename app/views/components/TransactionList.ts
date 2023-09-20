import { DBTransactionSelect } from "../../db/transactionService.js";
import { Fragment } from "preact";
import { html } from "../../utils/html.js";
import sanitize from "sanitize-html";

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

  return html`
    <div class="max-w-sm mx-auto px-2 space-y-2">
      ${Object.keys(groups)
        .sort((a, b) => (+a > +b ? -1 : 1))
        .map(
          (date) => html`
            <div>
              <div class="text-gray-700 text-sm font-semibold py-3 pb-2">
                ${secondsToPrettyString(+date)}
              </div>
              <div class="rounded-xl bg-gray-50 py-2 ring-2 ring-gray-950/5">
                ${groups[date]
                  .map(
                    (transaction, index) => html`
                      <a
                        x-data="{ 
                          itemId: ${transaction.id},
                          menuOpen: false,
                          async deleteItem() {
                            try {
                              const res = await fetch('/transactions/'+this.itemId, {
                                method: 'delete',
                              })
                              if(res.ok) {
                                window.location = window.location;
                              }
                            } catch(err) {
                              console.error(err)
                            }
                          }
                        }"
                        @click.away="menuOpen = false"
                        href=${`"/transactions/${transaction.id}/edit?month_key=${transaction.month_key}"`}
                        class="relative flex items-center py-2 pl-4 pr-2"
                      >
                        <div>
                          ${sanitize(transaction.description)}
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
                                fill=${`"hsl(${hash(
                                  sanitize(transaction.categoryText)
                                )}deg 100% 60%)"`}
                              />
                            </svg>
                            ${sanitize(transaction.categoryText)}
                          </div>
                        </div>
                        <div class="ml-auto">
                          ${moneyFormatter.format(transaction.amount / 100)}
                        </div>
                        <div>
                          <button
                            @click.prevent="menuOpen = !menuOpen"
                            type="button"
                            aria-label="actions"
                            class="relative p-1 -m-2 ml-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-6 h-6"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                              />
                            </svg>
                          </button>
                          <!-- dropdown -->
                          <div
                            style="display: none;"
                            class="absolute top-full right-0 p-2 rounded shadow-lg bg-white z-10 ring-1 ring-gray-950/5"
                            x-show="menuOpen"
                            x-transition.origin.top.left
                          >
                            <button
                              @click.prevent="deleteItem"
                              class="flex items-center gap-1 hover:bg-gray-50 rounded text-red-400"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-4 h-4"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>

                              Delete
                            </button>
                          </div>
                        </div>
                      </a>
                      ${index !== groups[date].length - 1
                        ? html`
                            <div
                              class="border-t border-t-gray-200 border-b border-b-white"
                            ></div>
                          `
                        : ""}
                    `
                  )
                  .join("")}
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}
