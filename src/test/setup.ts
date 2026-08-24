import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { resetAllFactories } from "./factories";

beforeEach(() => {
  resetAllFactories();
});

afterEach(() => {
  cleanup();
});
