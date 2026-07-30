import react from "@vitejs/plugin-react";
import unoCSS from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    conditions: ["@uikit/source"],
    dedupe: ["react", "react-dom"], // ensure `app`'s React@19 is loaded
  },
  plugins: [unoCSS(), react()],
});
