import { describe, expect, it } from "vitest";
import { getProducts, verifyCoa } from "./repository";

// DATABASE_URL is unset in the test env, so these exercise the seed backend.

describe("getProducts (seed backend)", () => {
  it("sorts by price ascending", async () => {
    const result = await getProducts({ sort: "price-asc" });
    for (let i = 1; i < result.length; i++) {
      expect(result[i].priceCents).toBeGreaterThanOrEqual(result[i - 1].priceCents);
    }
  });

  it("filters by category", async () => {
    const result = await getProducts({ category: "recovery" });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.categorySlug === "recovery")).toBe(true);
  });

  it("excludes out-of-stock when inStockOnly is set", async () => {
    const result = await getProducts({ inStockOnly: true });
    expect(result.every((p) => p.stock === "in_stock" || p.stock === "low_stock")).toBe(true);
  });

  it("matches a free-text search", async () => {
    const result = await getProducts({ search: "recovery" });
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("verifyCoa (seed backend)", () => {
  it("resolves a known batch case-insensitively", async () => {
    const coa = await verifyCoa("vp24-glp-7781");
    expect(coa?.batch).toBe("VP24-GLP-7781");
  });

  it("returns undefined for an unknown batch", async () => {
    expect(await verifyCoa("does-not-exist")).toBeUndefined();
  });
});
