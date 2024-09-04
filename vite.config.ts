import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

// declare const __dirname: string; // Add this line

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: "esbuild",
  },
  server: {
    port: 3011,
    open: true,
  },
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
