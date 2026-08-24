/**
 * Canonical error codes shared by every feature.
 * Features add their own codes on top (see `{name}.errors.ts`).
 */
export type ServiceErrorCode =
  | "unauthorized"
  | "not_found"
  | "validation_failed"
  | "conflict"
  | "db_error"
  | "network_error"
  | "unknown_error";

/**
 * The error every repository returns inside `Result<T>`.
 *
 * - `code`    : stable, machine-readable, used for branching.
 * - `message` : technical, English, for logs. Never rendered to a user.
 * - `cause`   : the raw underlying error, for debugging. Never rendered.
 *
 * Deliberately **no** `userMessage`: the UI layer picks that string from `code`,
 * in the user language. See `03-conventions.md` and `patterns/feedback.md`.
 */
export interface ServiceError {
  code: ServiceErrorCode | (string & {});
  message: string;
  cause?: unknown;
}

/**
 * Builds a `ServiceError` and logs it (English, technical).
 * The only place a `console.error` for a service failure belongs.
 */
export function serviceError(
  code: ServiceError["code"],
  message: string,
  cause?: unknown,
): ServiceError {
  console.error(`[${code}] ${message}`, cause ?? "");
  return { code, message, cause };
}

/**
 * Formats a `ServiceError` for a log line. **Logging only** — this never
 * produces a string meant for a user.
 */
export function formatServiceError(error: ServiceError): string {
  return `[${error.code}] ${error.message}`;
}

/**
 * Narrows an unknown value to a `ServiceError`.
 * Used in React Query `onError`, where the callback receives `unknown`.
 */
export function isServiceError(value: unknown): value is ServiceError {
  return (
    typeof value === "object" &&
    value !== null &&
    "code" in value &&
    "message" in value
  );
}
