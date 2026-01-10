import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import path from "node:path";

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "TypesciptBridgeLib",
      fileName: (format) => `vuetify-bridge-lib.${format}.js`
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
          vuetify:"Vuetify"
        }
      }
    }
  }
});