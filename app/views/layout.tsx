import { ComponentChildren } from "preact";
import { User } from "../db/userService.js";

export const MainLayout = ({
  currentUser,
  children,
}: {
  currentUser?: User;
  children: ComponentChildren;
}) => (
  <html>
    <head>
      <title>Spendough</title>
      <meta name="description" content="Easily track spending" />
      <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="/assets/style.css" />
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>📒</text></svg>"
      />
    </head>
    <body class="text-gray-700 bg-gray-200 flex font-sans">
      {currentUser && (
        <div
          id="sidebar-nav"
          class="border-r border-r-gray-300 flex-col md:flex bg-gray-100 target:fixed target:left-0 target:top-0 target:bottom-0 target:flex relative z-10 hidden"
        >
          <div class="flex items-center gap-1 text-xl font-semibold py-6 px-4">
            <svg
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
            >
              <text y="0.9em" font-size="90">
                📒
              </text>
            </svg>{" "}
            Spendough
          </div>
          <nav class="flex-1 pl-4">
            <ul class="space-y-2">
              <li>
                <a href="/" class="inline-flex gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                    />
                  </svg>
                  Home
                </a>
              </li>
              <li>
                <a href="/categories" class="inline-flex gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z"
                    />
                  </svg>
                  Categories
                </a>
              </li>
            </ul>
          </nav>
          <form action="/logout" method="post">
            <button class="pl-4" type="submit">
              Logout
            </button>
          </form>
        </div>
      )}
      <div class="flex-1 justify-center overflow-auto relative pb-16">
        <a href="#sidebar-nav" class="absolute ml-2 mt-2 px-2 py-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 md:hidden"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </a>
        {children}
      </div>
    </body>
  </html>
);
