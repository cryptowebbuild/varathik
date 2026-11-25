import preact from '@preact/preset-vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  // আপেক্ষিক বেস — GitHub Pages-এর সাবপাথে (/varathik/) ও রুট ডোমেইন দুটোতেই চলবে
  base: './',
})
