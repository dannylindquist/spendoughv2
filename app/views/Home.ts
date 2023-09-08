import { DBTransactionSelect } from "../db/transactionService.js";
import { User } from "../db/userService.js";
import { html } from "../utils/html.js";
import { TransactionList } from "./components/TransactionList.jsx";
import { MainLayout } from "./layout.js";

export type HomeProps = {
  currentUser: User;
  monthKey: number;
  transactions: DBTransactionSelect[];
};

const moneyFormatter = new Intl.NumberFormat("default", {
  style: "currency",
  currency: "USD",
});

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
  return MainLayout({
    currentUser,
    children: html`
      <div class="text-center mt-8 mb-4">
        <div class="text-3xl tabular-nums">
          ${moneyFormatter.format(total / 100)}
        </div>
        <div
          x-data="{ open: false, year: ${year}, month: ${month}, value: ${monthKey}}"
          @keydown.escape="open = false"
          class="mx-auto flex justify-center items-center gap-1 relative"
        >
          <h2 class="text-3xl font-black">
            ${date.toLocaleDateString("default", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <div>
            <button
              @click="open = !open"
              @click.away="open = false"
              type="button"
              aria-label="Select month"
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
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            <!-- dropdown -->
            <div
              style="display: none;"
              x-show="open"
              x-transition:enter="transition ease-out duration-100 origin-top-right"
              x-transition:enter-start="opacity-0 scale-90"
              x-transition:enter-end="opacity-100 scale-100"
              x-transition:leave="transition ease-in duration-100"
              x-transition:leave-start="opacity-100 scale-100"
              x-transition:leave-end="opacity-0 scale-90"
              @click.stop
              class="absolute p-4 bg-white shadow-md left-1/2 transform -translate-x-1/2 rounded-md mt-4"
            >
              <div class="flex gap-1 items-center">
                <button
                  @click="year--"
                  class="p-2 border leading-none rounded-md"
                >
                  &lt;
                </button>
                <div x-text="year" class="flex-1 font-semibold"></div>
                <button
                  @click="year++"
                  class="p-2 border leading-none rounded-md"
                >
                  &gt;
                </button>
              </div>
              <div
                class="grid grid-cols-[repeat(4,minmax(3rem,1fr))] gap-2 pt-4"
              >
                <template x-for="(_,index) in new Array(12).fill(1)">
                  <a
                    :href="'/'+year+(index+1).toString().padStart(2, '0')"
                    :class="{'ring-yellow-400 ring-2': (+month)-1 === index}"
                    class="py-3 px-2 rounded border w-12 h-12 flex item-center justify-center"
                    x-text="new Date(year, index, 1).toLocaleDateString('default', { month: 'short'})"
                  ></a>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a
        href=${`/transactions/new?month_key=${monthKey}`}
        class="border-gray-300 border-2 rounded-lg p-2 bg-gray-50 block w-fit mx-auto"
      >
        New Transaction
      </a>
      ${transactions.length === 0
        ? html`<div class="max-w-sm mx-auto text-center py-6">
            <p>No transactions for this month! Good job not spending money!</p>
          </div>`
        : TransactionList({ transactions })}
    `,
  });
};
