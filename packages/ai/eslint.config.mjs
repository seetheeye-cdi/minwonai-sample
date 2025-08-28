import baseConfig from "@myapp/eslint-config/base.js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
];
