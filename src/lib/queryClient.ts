import { QueryClient } from "@tanstack/react-query";
import { toServiceError } from "./result";

/**
 * Codes that describe a decision, not an incident. Retrying one of them cannot
 * change the answer — it only postpones the error state the UI has to show.
 *
 * A feature code that describes a decision belongs here too. Every
 * `{name}.errors.ts` declares its own codes and this set cannot see them; the
 * `*_not_found` shape is covered by `isNonRetryable`, anything else
 * (`quota_exceeded`, `agent_run_cancelled`) gets a line here, the same way it
 * gets one in `src/lib/userMessages.ts`.
 */
const NON_RETRYABLE: ReadonlySet<string> = new Set([
  "unauthorized",
  "not_found",
  "validation_failed",
  "conflict",
]);

/** A decision the server already made: a canonical code, or any `*_not_found`. */
function isNonRetryable(code: string): boolean {
  return NON_RETRYABLE.has(code) || code.endsWith("_not_found");
}

/**
 * The app-wide client, created once and injected at the composition root
 * (`src/main.tsx`).
 *
 * These defaults are a floor, not a policy: every hook still picks its own
 * `staleTime` / `gcTime` from the profile table in `patterns/react-query.md`.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) =>
        failureCount < 1 && !isNonRetryable(toServiceError(error).code),
    },
    mutations: { retry: false },
  },
});
