// Linting of the sources: the rules that catch errors, none that prescribe the format
// (the format is the one of the sources: four spaces and semicolons)
import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import vue from "eslint-plugin-vue"
import vueParser from "vue-eslint-parser"

export default tseslint.config(
    {
        ignores: ["dist/**", "node_modules/**", "coverage/**"],
    },
    // The rules of the language: no undefined variables, no unused ones
    js.configs.recommended,
    // The rules of TypeScript
    ...tseslint.configs.recommended,
    // The rules of Vue that prevent errors; the ones that prescribe the format are left out
    ...vue.configs["flat/essential"],
    {
        // The files that are linted
        files: ["**/*.{js,ts,vue}"],
    },
    {
        // The config files at the root run in Node
        files: ["*.js", "*.ts"],
        languageOptions: {
            globals: globals.node,
        },
    },
    {
        // The sources run in the browser
        files: ["src/**/*.{ts,vue}"],
        languageOptions: {
            globals: globals.browser,
        },
    },
    {
        // The components: the script of the single file component, parsed as TypeScript
        files: ["**/*.vue"],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: tseslint.parser,
                extraFileExtensions: [".vue"],
                sourceType: "module",
            },
        },
        rules: {
            // The name of a component is the name of its file
            "vue/multi-word-component-names": "off",
            // A prop that is not given is not the same as a prop with the value undefined: the components tell the
            // difference, so a default would change what they do
            "vue/require-default-prop": "off",
            // A test file may write several components
            "vue/one-component-per-file": "off",
        },
    },
    {
        // The model of a record is JSON of any shape: the types of the models say any on purpose
        files: ["src/**/*.{ts,vue}"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            // A prop without a type is a typo waiting to happen
            "vue/require-prop-types": "error",
        },
    },
)
