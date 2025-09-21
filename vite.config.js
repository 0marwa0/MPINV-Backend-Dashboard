import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
        // Map frontend '/api/*' to backend '/*'
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // For image assets served by the backend
      "/uploades": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
        // Some backends use '/uploads' (without the extra 'e')
        rewrite: (path) => path.replace(/^\/uploades/, "/uploads"),
      },
      "/uploads": {
        target: "http://localhost:4000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
