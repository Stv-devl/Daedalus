import { fileURLToPath, URL } from "node:url";
import { defineConfig, coverageConfigDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

/**
 * The four test-first layers (`.claude/rules/05-testing.md`), as a brace
 * expansion reused by every coverage glob below. Only copy outside
 * `.claude/hooks/hook-lib.sh` (`CWK_TDD_LAYERS`) — the two must cover the
 * same set, or a file ends up frozen and unmeasured.
 */
const TEST_FIRST = "{utils,mapper,repository,services}";

export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(new URL("./shared", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "shared/**/*.test.ts"],
    exclude: ["**/node_modules/**", "dist/**", "e2e/**", "supabase/functions/**"],
    coverage: {
      provider: "v8",
      include: [
        `src/**/*.${TEST_FIRST}.{ts,tsx}`,
        `src/**/${TEST_FIRST}.{ts,tsx}`,
        `shared/**/*.${TEST_FIRST}.ts`,
        `shared/**/${TEST_FIRST}.ts`,
        "src/lib/**/*.ts",
      ],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "src/lib/supabase.ts",
        "src/lib/client.ts",
        "src/lib/queryClient.ts",
        "src/lib/utils/cn.ts",
      ],
      thresholds: { lines: 90, functions: 90, branches: 85 },
    },
  },
});
