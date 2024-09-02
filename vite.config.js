import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/Pomodoro-Timer/", // 添加这一行
  plugins: [vue()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
