import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'virtual-sources-raw',
      resolveId(id, importer) {
        if (id.includes('/sources/') && id.endsWith('.html?raw') && importer) {
          const rawRelative = id.replace('?raw', '');
          const absPath = path.resolve(path.dirname(importer), rawRelative);
          if (!fs.existsSync(absPath)) {
            return '\0' + id;
          }
        }
      },
      load(id) {
        if (id.startsWith('\0') && id.includes('/sources/') && id.endsWith('.html?raw')) {
          return 'export default "";';
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@designcodeio/threeui/style.css': path.resolve(process.cwd(), 'src/shaders/threeui.css'),
      '@designcodeio/threeui': path.resolve(process.cwd(), 'src/shaders/index.ts'),
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
})
