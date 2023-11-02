import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { previewIcons } from './vitePlugin'
import svgData from './svg-importer.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [previewIcons(Object.keys(svgData)), vue(),],
})
