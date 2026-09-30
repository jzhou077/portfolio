import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    // Powers the "last updated" line in the footer.
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
});
