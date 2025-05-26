import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      js,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-undef": "error", // ❗ Catch undeclared variables
      "no-unused-vars": "warn", // ⚠ Warn unused vars
      "no-redeclare": "error", // ❗ Prevent duplicate declarations
      "no-const-assign": "error", // ❗ Prevent reassigning const
    },
  },
  pluginReact.configs.flat.recommended,
]);
