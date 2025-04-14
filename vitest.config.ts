import * as path from "path";
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: "jsdom",
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    include: ['./{src,src-server}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ["vitest.setup.ts"]
  },
});