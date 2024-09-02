import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/Pomodoro-Timer/", // 这里的路径应该是你的 GitHub 仓库名
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
