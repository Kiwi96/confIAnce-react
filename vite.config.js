import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
plugins: [
react(),
tailwindcss(),],
  server: {
    host: true,         // Necesario para que conecte bien con WSL
    port: 5501,         // <-- AQUÍ pones el nuevo puerto que quieras usar
    watch: {
      usePolling: true  // Evita fallos de actualización en WSL
    }
  }
})
