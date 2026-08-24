type ClassValue = string | number | null | undefined | false;

/**
 * Joins class names, dropping falsy values. Lives under `lib/utils/` rather
 * than a bare `lib/utils.ts`, which the TDD hooks treat as a test-first layer
 * (`05-testing.md`).
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
