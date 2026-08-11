import { describe, it, expect } from "vitest";
import { validateLoginInput } from "./loginValidation";

describe("validateLoginInput", () => {
  it("accepts a well-formed email and non-empty password", () => {
    expect(validateLoginInput("r.krishnamurthy@planmaster.ai", "anything")).toEqual({ valid: true });
  });

  it("accepts any syntactically valid email domain, not just gmail", () => {
    expect(validateLoginInput("someone@example.com", "pw")).toEqual({ valid: true });
  });

  it("rejects an email with no @", () => {
    expect(validateLoginInput("not-an-email", "pw")).toEqual({
      valid: false,
      error: "Enter a valid email address.",
    });
  });

  it("rejects an email with no domain", () => {
    expect(validateLoginInput("user@", "pw")).toEqual({
      valid: false,
      error: "Enter a valid email address.",
    });
  });

  it("rejects an empty password", () => {
    expect(validateLoginInput("user@example.com", "")).toEqual({
      valid: false,
      error: "Enter a password.",
    });
  });

  it("rejects a whitespace-only password", () => {
    expect(validateLoginInput("user@example.com", "   ")).toEqual({
      valid: false,
      error: "Enter a password.",
    });
  });
});
