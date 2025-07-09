import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({

  plugins: [react(),

  ],
  resolve: {
    alias: [
      // Add other aliases as needed
    ],
  },
  // Optional: Define global for compatibility
  define: {
    global: {},
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
    watch: {
      usePolling: true,  // Especially helpful for WSL, Docker, or network filesystems
      interval: 1000     // Polling interval in ms
    },
    hmr: {
      overlay: true      // Show error overlay when HMR fails
    }

  },

})
