// @ts-check
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettierConfig = require("eslint-config-prettier");

/**
 * Shared TypeScript rules applied in the TS config block.
 * Consumers spread this into their own `rules` object.
 */
const sharedTsRules = {
  ...tseslint.configs["recommended"].rules,

  // Null safety
  "no-unsafe-optional-chaining": "error",
  "@typescript-eslint/no-unnecessary-condition": "error",
  "@typescript-eslint/no-non-null-assertion": "warn",
  "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
  "@typescript-eslint/prefer-optional-chain": "error",
  "@typescript-eslint/prefer-nullish-coalescing": [
    "error",
    {
      ignoreConditionalTests: true,
      ignorePrimitives: { string: true, number: true, boolean: true },
    },
  ],

  "no-restricted-syntax": [
    "warn",
    {
      selector:
        "LogicalExpression[operator='??'][right.type='Literal'][right.raw='null']",
      message:
        "Avoid `?? null`; keep `undefined` unless a boundary contract requires `null`.",
    },
  ],
};

/**
 * Shared base JS rules applied to all files.
 */
const sharedBaseRules = {
  // Code style
  "object-shorthand": "error",
  "prefer-destructuring": "warn",
  "prefer-arrow-callback": "error",
  "prefer-const": "error",

  // Formatting (backup for lines Prettier can't wrap)
  "max-len": ["warn", { code: 100, ignoreUrls: true, ignoreStrings: true }],

  // Logging
  "no-console": ["warn", { allow: ["warn", "error"] }],
};

/**
 * Full standalone config for environments that don't use expoConfig
 * (e.g. convex). Registers @typescript-eslint plugin itself.
 *
 * @type {import('eslint').Linter.Config[]}
 */
const standaloneConfig = [
  // Base JS rules
  {
    rules: sharedBaseRules,
  },

  // TypeScript rules with plugin registration
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: sharedTsRules,
  },

  // Prettier must be last
  prettierConfig,
];

module.exports = {
  standaloneConfig,
  sharedBaseRules,
  sharedTsRules,
  prettierConfig,
};
