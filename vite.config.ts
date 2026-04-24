import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 👇 REPLACE with your actual GitHub repo name (e.g., '/spotter/')
const REPO_NAME = '/spotter/'

export default defineConfig({
  base: import.meta.env.PROD ? REPO_NAME : '/',
  plugins: [react()],
})