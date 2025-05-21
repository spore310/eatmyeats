// scripts/tsup.config.ts
import { defineConfig } from "tsup";
import path from "path";

export default defineConfig({
  //Change entry with the file you want to compile
  entry: [path.resolve(__dirname, "index.ts")],
  outDir: path.resolve(__dirname, "dist"),
  format: ["cjs"],
  target: "es2020",
  clean: true,
  dts: false,
  splitting: false,
  minify: false,
  sourcemap: false,
  external: ["@prisma/client", ".prisma/client", "fs", "path"],
});
