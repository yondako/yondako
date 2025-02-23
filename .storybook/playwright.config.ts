import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  snapshotPathTemplate: "../__snapshots__/{testFilePath}/{arg}{ext}",
  reporter: process.env.CI ? "blob" : "html",
  timeout: 30 * 1000,
  retries: 1,
  fullyParallel: true,
  expect: {
    timeout: 10 * 1000,
    toMatchSnapshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL: "http://localhost:6006",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "safari",
      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],
});
