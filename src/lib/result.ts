import { isServiceError, type ServiceError } from "./errors";

/**
 * The value every repository returns. Never throws — the failure is data.
 */
export type Result<T, E = ServiceError> =
  | { success: true; data: T }
  | { success: false; error: E };

/** Builds a success result. */
export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

/** Builds a failure result. */
export function err<T = never>(error: ServiceError): Result<T> {
  return { success: false, error };
}

/**
 * Error thrown by `unwrap`. Carries the `ServiceError` so React Query's
 * `error` stays typed and the UI can branch on `error.code`.
 */
export class ServiceFailure extends Error {
  readonly serviceError: ServiceError;

  constructor(error: ServiceError) {
    super(error.message);
    this.name = "ServiceFailure";
    this.serviceError = error;
  }
}

/**
 * Unwraps a `Result<T>` for React Query: returns the data, or throws so that
 * `isError` / `error` fire.
 *
 * This is the **one** sanctioned throw in the codebase, and it lives in the
 * hook layer — repositories still never throw.
 */
export function unwrap<T>(result: Result<T>): T {
  if (result.success) return result.data;
  throw new ServiceFailure(result.error);
}

/**
 * Extracts the `ServiceError` from whatever React Query hands `onError`.
 */
export function toServiceError(error: unknown): ServiceError {
  if (error instanceof ServiceFailure) return error.serviceError;
  if (isServiceError(error)) return error;
  return {
    code: "unknown_error",
    message: error instanceof Error ? error.message : String(error),
    cause: error,
  };
}
