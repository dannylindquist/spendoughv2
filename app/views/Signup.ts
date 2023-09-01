import { html } from "../utils/html.js";
import { MainLayout } from "./layout.js";

export const SignupView = ({ error }: { error?: string }) =>
  MainLayout({
    children: html`
      <div class="max-w-lg mx-auto px-2">
        <h2 class="text-4xl font-black py-4 text-center">Sign Up</h2>
        <form action="/signup" method="post" class="flex flex-col gap-2">
          ${error ? html`<p class="bg-red-100 p-2">${error}</p>` : ""}
          <div>
            <label for="email">Email:</label>
            <input
              class="px-2 py-2 border block w-full"
              type="email"
              name="email"
              id="email"
              required
            />
          </div>
          <div>
            <label for="password">Password:</label>
            <input
              class="px-2 py-2 border block w-full"
              type="password"
              name="password"
              id="password"
              required
            />
          </div>
          <div>
            <label for="password-confirm">Confirm Password:</label>
            <input
              class="px-2 py-2 border block w-full"
              type="password"
              name="password-confirm"
              id="password-confirm"
              required
            />
          </div>
          <button class="border px-6 py-2" type="submit">Sign up</button>
        </form>
        <div class="text-center">
          <a class="underline" href="/login"> Already have an account? </a>
        </div>
      </div>
    `,
  });
