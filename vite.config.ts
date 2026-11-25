import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // আপেক্ষিক বেস — GitHub Pages-এর সাবপাথে (/varathik/) ও রুট ডোমেইন দুটোতেই চলবে
  base: './',
})
