import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  { rules: { "no-console": "error" } },
  {
    files: ["src/pages/api/**/*.ts"],
    rules: { "no-console": ["error", { allow: ["error", "warn"] }] },
  },
  {
    ignores: [
      "dist/**",
      ".astro",
      ".netlify/**",
      "reference/**",
      "build/**",
      "node_modules/**",
    ],
  },
];
