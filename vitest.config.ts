import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [
        vue()
    ],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./src/test/setup.ts",
        css: false, // Disable CSS processing to avoid errors
        pool: 'vmThreads', // Resolves the CSS extension error
        server: {
            deps: {
            },
        },
    }
});
