import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import {fileURLToPath} from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: './postcss.config.cjs'
  },
  server: {
    port:  3230,
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
