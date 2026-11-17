import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Without an API URL a production build would call nothing and every game
  // would fail, so stop the build instead of deploying a broken site.
  if (command === "build") {
    const { VITE_API_URL } = loadEnv(mode, import.meta.dirname);
    if (!VITE_API_URL) {
      throw new Error(
        "VITE_API_URL is not set. Set it to the API's base URL (e.g. https://api.example.com) in your deploy environment or apps/web/.env.",
      );
    }
    if (!/^https?:\/\//.test(VITE_API_URL)) {
      throw new Error(
        `VITE_API_URL must start with http:// or https:// (got "${VITE_API_URL}").`,
      );
    }
  }

  return {
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
  };
});
