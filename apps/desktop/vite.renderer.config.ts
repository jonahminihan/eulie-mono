import { defineConfig } from "vite";
import path from "node:path";

// https://vitejs.dev/config
export default defineConfig({
  //   root: "dist-renderer",
  //   assetsInclude: ["dist-renderer/**/*"],
  publicDir: path.resolve(__dirname, "../web/dist"),
  build: {
    minify: false,
    outDir: ".vite/build/renderer",
    // assetsDir: "dist-renderer",
    // sourcemap: true,
    // rollupOptions: {
    //   input: "dist-renderer/index.html",
    // },
  },
});
