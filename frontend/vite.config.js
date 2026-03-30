import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  define: {
    global: "window"
  },
  plugins: [react()],
  server: {
    proxy: {
      "/clientes": "http://localhost:8181",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
