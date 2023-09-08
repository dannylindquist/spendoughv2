import { watch } from "node:fs";
import { join } from "node:path";

const assets = [
  join(import.meta.dir, "../assets/app.ts"),
  join(import.meta.dir, "../assets/login.ts"),
];

export function buildAssets() {
  return Bun.build({
    entrypoints: assets,
    outdir: "./app/public",
    minify: true,
    splitting: true,
    format: "esm",
  });
}

export async function runWatcher() {
  await buildAssets();
  return watch(
    join(import.meta.dir, "../assets"),
    {},
    async (event, filename) => {
      console.log(event, filename);
      console.log(await buildAssets());
    }
  );
}
