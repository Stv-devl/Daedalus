/**
 * The one place a `ServiceError` code becomes user copy, in the user language
 * declared by `03-conventions.md` (French). `ServiceError.message` stays
 * technical English, for logs only.
 *
 * All seven canonical codes of `lib/errors.ts` get a line: a missing one is not
 * a smaller table, it is a code that silently renders the fallback. Feature
 * codes (`{name}.errors.ts`) are added here in the same lower snake_case.
 */
const MESSAGES: Record<string, string> = {
  unauthorized: "Vous n’avez pas accès à cette ressource.",
  not_found: "Élément introuvable.",
  validation_failed: "Certaines informations sont invalides.",
  conflict: "Cet élément a déjà été modifié ailleurs.",
  db_error: "L’opération a échoué. Réessayez.",
  network_error: "Connexion impossible. Réessayez.",
  unknown_error: "Une erreur inattendue est survenue.",
};

/**
 * User-facing message for a ServiceError code. Falls back to a generic one —
 * a code must never reach the screen.
 */
export function userMessageFor(code: string): string {
  return MESSAGES[code] ?? "Une erreur est survenue.";
}
