import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path will be overridden by GitHub Actions during deployment
  // For local development, use '/'
  base: process.env.VITE_BASE_PATH || '/',
})
