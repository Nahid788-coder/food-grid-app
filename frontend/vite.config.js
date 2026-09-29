/* global process */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed at the domain root on Vercel. For the old GitHub Pages copy build with
// VITE_BASE=/live-designs/pizza/ npm run build
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
})
