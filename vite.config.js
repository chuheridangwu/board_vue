import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // 这行是必须的，为了让Cloudflare能正确处理路由
  base: '/',
})
