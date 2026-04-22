import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['95d0-122-179-161-239.ngrok-free.app'],
    // or use this to allow all (less secure):
    // allowedHosts: 'all',
  },
});
