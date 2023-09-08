import { AlpineComponent } from "alpinejs";

type LoginComponent = AlpineComponent<{
  error: string;
  login(): Promise<void>;
}>;

document.addEventListener("alpine:init", () => {
  Alpine.data(
    "loginForm",
    () =>
      <LoginComponent>{
        error: "",
        async login() {
          const formData = new FormData(this.$el as HTMLFormElement);
          const res = await fetch("/login", {
            method: "POST",
            body: formData,
            headers: {
              accept: "application/json",
            },
          });
          if (!res.ok) {
            const json = await res.json();
            this.error = json.message;
          } else {
            const date = new Date();
            const monthKey =
              date.getFullYear() +
              (date.getMonth() + 1).toString().padStart(2, "0");
            this.$router.go("/" + monthKey);
          }
        },
      }
  );
});
