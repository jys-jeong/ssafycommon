// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // 경로 조작을 위한 모듈

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // @ → src 폴더
    },
  },
  build: {
    outDir: "./client/dist",
  },
});
