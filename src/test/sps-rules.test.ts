import { describe, expect, it } from "vitest";
import { headlineFor, isFreeEmail, leadQuality } from "@/lib/sps";

describe("lead qualification", () => {
  it("qualified when company has 51+ staff", () => {
    expect(leadQuality("51 to 200")).toBe("qualified");
    expect(leadQuality("1,000+")).toBe("qualified");
  });
  it("standard when company is 1 to 50", () => {
    expect(leadQuality("1 to 50")).toBe("standard");
  });
});

describe("work email", () => {
  it("rejects free providers", () => {
    for (const d of ["gmail.com", "yahoo.co.uk", "hotmail.com", "outlook.com", "icloud.com", "live.com"])
      expect(isFreeEmail(`a@${d}`)).toBe(true);
  });
  it("accepts company domains", () => {
    expect(isFreeEmail("a@acme.ae")).toBe(false);
  });
});

describe("headline", () => {
  it("matches topic", () => {
    expect(headlineFor("sales")).toBe("Sales and customer service training that lifts team performance");
    expect(headlineFor("other")).toBe("Corporate Training built around your team");
  });
});
