import { describe, expect, it } from "vitest";
import { userMessageFor } from "./userMessages";

describe("userMessageFor", () => {
  it("returns the message declared for a known code", () => {
    expect(userMessageFor("not_found")).toBe("Élément introuvable.");
  });

  it("falls back to the generic message for a code nobody declared", () => {
    expect(userMessageFor("code_that_does_not_exist")).toBe(
      "Une erreur est survenue.",
    );
  });
});
