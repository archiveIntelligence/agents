import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Native resolution of the "@/*" alias from tsconfig.json.
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // Ensure the repository layer uses the seed dataset, not a database.
    env: { DATABASE_URL: "" },
  },
});
