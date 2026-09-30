import { defineConfig, devices } from "@playwright/test";

// Browser tests. Run with: npm run test:e2e
// They build and run the real production site (offline support only runs
// there), pointed at a stand-in Supabase with the PLACEHOLDER test data.
const PORT = 3100;
const MOCK_PORT = 54329;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    // A typical Android phone screen.
    ...devices["Pixel 5"],
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },
  webServer: [
    {
      command: "node e2e/mock-supabase.mjs",
      url: `http://127.0.0.1:${MOCK_PORT}/health`,
      env: { MOCK_SUPABASE_PORT: String(MOCK_PORT) },
      reuseExistingServer: false,
    },
    {
      command: `npm run build && npx next start -p ${PORT}`,
      port: PORT,
      timeout: 300_000,
      reuseExistingServer: false,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${MOCK_PORT}`,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
      },
    },
  ],
});
