import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 子路径部署，资源路径需要加上仓库名前缀
  base: '/erp-system/',
  plugins: [vue()],
  resolve: {
    // 配置 @ 别名指向 src 目录
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '127.0.0.1',
    port: 8080
  }
})
