import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  snapshotPathTemplate: "{testFilePath}-snapshots/{arg}{ext}",
  reporter: "html",
  timeout: 30 * 1000,
  retries: 2,
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
