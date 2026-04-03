import { defineConfig } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/strellis/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    },
  },
  optimizeDeps: {
    include: [
      "codemirror",
      "@codemirror/state",
      "@codemirror/view",
      "@codemirror/language",
      "@codemirror/commands",
      "@codemirror/lang-javascript",
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@sass": path.resolve(__dirname, "./src/sass"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
    dedupe: [
      "lit",
      "@codemirror/state",
      "@codemirror/view",
      "@codemirror/lang-javascript",
    ],
  },
});
