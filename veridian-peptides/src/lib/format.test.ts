import { describe, expect, it } from "vitest";
import { formatPrice, stockLabel } from "./format";

describe("formatPrice", () => {
  it("formats cents as EUR", () => {
    expect(formatPrice(8900)).toContain("89");
    expect(formatPrice(8900)).toMatch(/€/);
  });
});

describe("stockLabel", () => {
  it("maps stock statuses to tone", () => {
    expect(stockLabel("in_stock").tone).toBe("ok");
    expect(stockLabel("low_stock").tone).toBe("warn");
    expect(stockLabel("out_of_stock").tone).toBe("off");
  });
});
