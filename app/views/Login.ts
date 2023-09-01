import { html } from "../utils/html.js";
import { MainLayout } from "./layout.js";

export const LoginView = ({ error }: { error?: string }) =>
  MainLayout({
    children: html`
      <div class="max-w-lg mx-auto px-2">
        <h2 class="text-4xl font-black py-4 text-center">Login</h2>
        <form
          x-data="{
            error: '', 
            async login() {
              const formData = new FormData(this.$el);
              const res = await fetch('/login', {
                method: 'POST',
                body: formData,
                headers: {
                  'accept': 'application/json'
                }
              });
              console.log(res)
            }
          }"
          @submit.prevent="login"
          action="/login"
          method="post"
          class="flex flex-col gap-2"
        >
          <p x-show="error" x-text="error" class="bg-red-100 p-2"></p>
          <div>
            <label for="email">Email:</label>
            <input
              class="px-2 py-2 border block w-full"
              type="email"
              name="email"
              id="email"
            />
          </div>
          <div>
            <label for="password">Password:</label>
            <input
              class="px-2 py-2 border block w-full"
              type="password"
              name="password"
              id="password"
            />
          </div>
          <button class="border px-6 py-2" type="submit">Login</button>
        </form>
        <div class="text-center">
          <a class="underline" href="/signup"> Don't have an account yet? </a>
        </div>
      </div>
    `,
  });
