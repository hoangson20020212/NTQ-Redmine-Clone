import { defineConfig } from "vitest/config";
import path from "path";
export default defineConfig({
  test: {
    testTimeout: 30000,
    coverage: {
      provider: "istanbul", //'istanbul' or 'v8'
      reporter: ["text", "json", "html"],
      reportsDirectory: "./coverage",
    },
    globals: true,
    environment: "jsdom",
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
});
