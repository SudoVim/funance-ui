import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      features: resolve(root, "src/features"),
      components: resolve(root, "src/components"),
      test: resolve(root, "src/test"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["src/setupTests.ts"],
  },
  plugins: [react()],
});
