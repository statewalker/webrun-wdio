import { resolve as pathResolve } from "path";
import { defineConfig, loadEnv } from "vite";

const resolve = (path) => pathResolve(__dirname, path);

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const buildExtra =
    mode == "production"
      ? { minify: true }
      : { minify: false, sourcemap: true };

  return defineConfig({
    resolve: {
      alias: {
        "~": resolve("./src"),
      },
    },
    base: "./",
    build: {
      ...buildExtra,
      outDir: "./dist",
      ssr: "index",
      rollupOptions: {
        input: {
          index: resolve("./src/index.ts"),
        },
      },
    },
  });
};
