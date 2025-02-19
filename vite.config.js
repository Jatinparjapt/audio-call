import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server : {
    host: "0.0.0.0", // Allows external access
    port: 5173, // Use your actual port
    strictPort: true, // Ensures it doesn't switch ports
    allowedHosts: ["https://6699-223-185-54-198.ngrok-free.app"], 
  }
})
