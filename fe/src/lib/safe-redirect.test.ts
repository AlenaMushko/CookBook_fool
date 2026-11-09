import { describe, expect, it } from "vitest";

import { safeRedirectPath } from "./safe-redirect";

const origin = "https://cookbook.example";

describe("safeRedirectPath", () => {
  it("keeps a same-origin path and query", () => {
    expect(safeRedirectPath("/recipes?q=soup", origin)).toBe("/recipes?q=soup");
  });

  it("rejects other sites and non-strings", () => {
    expect(
      safeRedirectPath("https://evil.example/recipes", origin)
    ).toBeUndefined();
    expect(safeRedirectPath("//evil.example/recipes", origin)).toBeUndefined();
    expect(safeRedirectPath(undefined, origin)).toBeUndefined();
  });

  it("rejects control characters and backslashes", () => {
    expect(safeRedirectPath("/rec\nipes", origin)).toBeUndefined();
    expect(safeRedirectPath("/recipes\\admin", origin)).toBeUndefined();
  });
});
