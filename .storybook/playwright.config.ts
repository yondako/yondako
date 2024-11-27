import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  snapshotPathTemplate: "../__snapshots__/{testFilePath}/{arg}{ext}",
  reporter: "html",
  timeout: 30 * 1000,
  retries: 1,
  fullyParallel: true,
  expect: {
    timeout: 10 * 1000,
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
  ],
});
