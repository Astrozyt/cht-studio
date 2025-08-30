import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@studio': path.resolve(__dirname, '../src'),
      '@ght/stores': path.resolve(__dirname, '../stores/src'),
    }
  },
  optimizeDeps: {
    exclude: ['@studio']
  },
  server: {
    fs: {
      // 👇 Allow access to the parent `studio/src` directory
      allow: ['..']
    }
  }
})
