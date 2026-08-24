import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import vitest from "@vitest/eslint-plugin";

export default [
  {
    ignores: [
      "dist/**",
      "coverage/**",
      "e2e/**",
      "supabase/functions/**",
      "app/**",
      // The FastAPI addon puts a Python virtualenv at the repo root, and it
      // ships vendored .js — 34 lint errors from site-packages, in a tree no
      // one here wrote. Not covered by `node_modules` (ESLint's own default).
      ".venv/**",
      "src/routeTree.gen.ts",
    ],
  },

  ...tseslint.config({
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
  }),

  // `recommended-latest`, not `recommended`: only that preset carries the React
  // Compiler diagnostics, and `react-hooks/unsupported-syntax` is the ONLY
  // signal that the compiler silently skipped a component (`01-stack.md`).
  // It is a `warn`, so `--max-warnings=0` is what turns it into a gate.
  // A config object with no `files` lints nothing on its own — hence the map.
  ...reactHooks.configs["recommended-latest"].map((config) => ({
    ...config,
    files: ["**/*.{js,jsx,ts,tsx}"],
  })),

  {
    ...jsxA11y.flatConfigs.recommended,
    files: ["**/*.tsx"],
  },

  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    plugins: { vitest },
    // `typecheck: true` is what makes `expect-expect` accept `expectTypeOf(...)`
    // as an assertion — but it also switches `valid-title` to a TYPED rule, and
    // a typed rule with no program crashes the whole run. The two lines go
    // together; removing either one is what breaks `pnpm lint`.
    settings: { vitest: { typecheck: true } },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/expect-expect": "error",
      "vitest/no-focused-tests": "error",
      "vitest/no-disabled-tests": "error",
      "vitest/no-conditional-expect": "error",
      "vitest/no-identical-title": "error",
    },
  },
];
