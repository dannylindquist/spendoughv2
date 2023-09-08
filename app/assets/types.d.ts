import { Alpine } from "alpinejs";

export {};

declare global {
  interface Window {
    Alpine: Alpine;
  }
  var Alpine: Alpine;
}

declare module "alpinejs" {
  interface AlpineMagics {
    $router: {
      go(path: string): void;
    };
    $monthKey(date: Date): string;
  }
}
