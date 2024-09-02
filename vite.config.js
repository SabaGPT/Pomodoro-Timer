import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/Pomodoro-Timer/',
  plugins: [vue()],
  build: {
    outDir: 'dist', // 确保这里设置正确
  },
})
