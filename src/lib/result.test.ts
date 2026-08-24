import { describe, it, expect, vi } from "vitest";
import { ok, err, unwrap, toServiceError, ServiceFailure } from "./result";
import { formatServiceError, isServiceError, serviceError } from "./errors";

describe("unwrap", () => {
  it("returns the data on success", () => {
    expect(unwrap(ok(42))).toBe(42);
  });

  it("throws a ServiceFailure carrying the error on failure", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const failure = err(serviceError("not_found", "Item missing"));

    expect(() => unwrap(failure)).toThrow(ServiceFailure);

    let caught: unknown;
    try {
      unwrap(failure);
    } catch (e) {
      caught = e;
    }
    expect(toServiceError(caught).code).toBe("not_found");
  });
});

describe("toServiceError", () => {
  it("returns the ServiceError carried by a ServiceFailure", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const original = serviceError("conflict", "Already modified");

    expect(toServiceError(new ServiceFailure(original))).toBe(original);
  });

  it("passes a bare ServiceError-shaped object through untouched", () => {
    const shaped = { code: "not_found", message: "Item missing" };

    expect(toServiceError(shaped)).toEqual(shaped);
  });

  it("falls back to unknown_error on a plain Error", () => {
    expect(toServiceError(new Error("boom")).code).toBe("unknown_error");
  });

  it("stringifies a thrown non-Error value", () => {
    expect(toServiceError("boom")).toEqual({
      code: "unknown_error",
      message: "boom",
      cause: "boom",
    });
  });
});

describe("serviceError", () => {
  it("returns the code, message and cause it was given", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const cause = new Error("underlying");

    expect(serviceError("db_error", "Insert failed", cause)).toEqual({
      code: "db_error",
      message: "Insert failed",
      cause,
    });
  });
});

describe("formatServiceError", () => {
  it("renders the code and the technical message on one line", () => {
    expect(
      formatServiceError({ code: "db_error", message: "Insert failed" }),
    ).toBe("[db_error] Insert failed");
  });
});

describe("isServiceError", () => {
  it("accepts an object carrying a code and a message", () => {
    expect(isServiceError({ code: "not_found", message: "gone" })).toBe(true);
  });

  it("rejects null, which is typeof object", () => {
    expect(isServiceError(null)).toBe(false);
  });

  it("rejects a plain Error, which has no code", () => {
    expect(isServiceError(new Error("boom"))).toBe(false);
  });
});
