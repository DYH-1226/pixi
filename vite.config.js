import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', //解决打包资源路径不匹配的问题
  server: {
    host: true,
    // proxy: ,
  },
})
