import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@studio': path.resolve(__dirname, '../src'),
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
