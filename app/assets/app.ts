import Alpine from "alpinejs";

window.Alpine = Alpine;

Alpine.magic("router", () => ({
  go(path: string) {
    window.location.assign(path);
  },
}));
Alpine.magic("monthKey", () => (date: Date) => {
  return date.getFullYear() + (date.getMonth() + 1).toString().padStart(2, "0");
});

Alpine.start();
