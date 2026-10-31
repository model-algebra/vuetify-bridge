import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import path from "node:path";

// Peer dependencies and the model package are provided by the application, never bundled
const EXTERNAL = /^(vue|vuetify|model-algebra-common)(\/.*)?$/;

const UMD_GLOBALS: Record<string, string> = {
  "vue": "Vue",
  "vuetify": "Vuetify",
  "vuetify/components": "Vuetify.components",
  "model-algebra-common": "ModelAlgebraCommon",
};

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "VuetifyBridge",
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      external: (id) => EXTERNAL.test(id),
      output: {
        globals: (id) => UMD_GLOBALS[id] ?? id
      }
    }
  }
});
