import { MainLayout } from "./layout.jsx";

export const LoginView = ({ error }: { error?: string }) => (
  <MainLayout>
    <div class="max-w-lg mx-auto px-2">
      <h2 class="text-4xl font-black py-4 text-center">Login</h2>
      <form action="/login" method="post" class="flex flex-col gap-2">
        {error && <p class="bg-red-100 p-2">{error}</p>}
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
        <button class="border px-6 py-2" type="submit">
          Login
        </button>
      </form>
      <div class="text-center">
        <a class="underline" href="/signup">
          Don't have an account yet?
        </a>
      </div>
    </div>
  </MainLayout>
);
