import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 2048,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) {
            return 'react'
          }

          if (id.includes('node_modules/react-router-dom') || id.includes('node_modules/react-helmet-async')) {
            return 'routing'
          }

          if (id.includes('node_modules/firebase')) {
            return 'firebase'
          }

          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }

          return undefined
        },
      },
    },
  },
})
