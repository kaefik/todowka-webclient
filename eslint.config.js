import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [".next/", "node_modules/", "**/__tests__/**"],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: nextPlugin.configs.recommended.rules,
  },
];
