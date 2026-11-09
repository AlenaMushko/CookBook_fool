import { describe, expect, it } from "vitest";

import {
  homeStateFromSearch,
  parseHomeSearch,
  toHomeSearch,
} from "./home-search";

describe("home search", () => {
  it("drops empty filters from the URL search", () => {
    expect(toHomeSearch({ q: "", category: undefined })).toEqual({});
    expect(toHomeSearch({ q: "soup", category: "baking" })).toEqual({
      q: "soup",
      category: "baking",
    });
  });

  it("reads only string query values", () => {
    expect(parseHomeSearch({ q: "soup", category: 12 })).toEqual({ q: "soup" });
    expect(homeStateFromSearch({})).toEqual({ q: "" });
  });
});
