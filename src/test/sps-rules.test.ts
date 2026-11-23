import { describe, expect, it } from "vitest";
import { headlineFor, leadQuality } from "@/lib/sps";

describe("lead qualification", () => {
  it("qualified when company has 51+ staff", () => {
    expect(leadQuality("51 to 200")).toBe("qualified");
    expect(leadQuality("1,000+")).toBe("qualified");
  });
  it("standard when company is 1 to 50", () => {
    expect(leadQuality("1 to 50")).toBe("standard");
  });
});

describe("headline", () => {
  it("matches topic", () => {
    expect(headlineFor("sales")).toBe("Sales and customer service training that lifts team performance");
    expect(headlineFor("other")).toBe("Corporate Training built around your team");
  });
});
