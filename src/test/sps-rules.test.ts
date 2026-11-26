import { describe, expect, it } from "vitest";
import { adSource, headlineFor, leadQuality } from "@/lib/sps";

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
    expect(headlineFor("employee")).toContain("Employee and staff training");
    expect(headlineFor("hr-training")).toContain("HR training");
    expect(headlineFor("communication")).toContain("Communication and soft skills");
    expect(headlineFor("other")).toBe("Corporate Training built around your team");
  });
});

describe("ad source", () => {
  it("labels where the lead came from", () => {
    expect(adSource({ gclid: "abc" })).toBe("Google Ads click");
    expect(adSource({ wbraid: "x" })).toBe("Google Ads click");
    expect(adSource({ referrer: "direct" })).toBe("Not from an ad (came from: direct)");
  });
});

import { emailError, nameError } from "@/lib/sps";
describe("junk lead checks", () => {
  it("rejects junk names and emails, keeps real ones", () => {
    expect(nameError("Hh")).not.toBe("");
    expect(nameError("aaaa")).not.toBe("");
    expect(nameError("Nahid Elias")).toBe("");
    expect(nameError("Li")).toBe("");
    expect(emailError("hhhh@gmail.vom")).not.toBe("");
    expect(emailError("ali@gmial.com")).not.toBe("");
    expect(emailError("Info@lawyerpoint.net")).toBe("");
    expect(emailError("sara@company.om")).toBe("");
    expect(emailError("hr@firm.co.uk")).toBe("");
  });
});
