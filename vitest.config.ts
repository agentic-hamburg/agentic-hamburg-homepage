import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Integration tests run against a live server — no transforms needed
    include: ["src/**/__tests__/**/*.test.ts"],
    testTimeout: 15000,
    sequence: {
      // Run tests in order within each file (important for stateful flow tests)
      concurrent: false,
    },
  },
});
