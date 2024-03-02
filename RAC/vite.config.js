import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/users/signup": "http://localhost:5001",
      "/users/verifyUID": "http://localhost:5001",
      "/users/signin": "http://localhost:5001",
    },
  },

  plugins: [react()],
  // vite.config.js
});
