// frontend/playwright.config.js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	timeout: 30_000,
	reporter: [["html", { outputFolder: "./tests/e2e/reports" }]],

	outputDir: "test-results/",

	use: {
		baseURL: "http://localhost:3000",
		screenshot: "only-on-failure",
		trace: "retain-on-failure",
	},

	webServer: {
		command: "npm run dev",
		url: "http://localhost:3000",
		timeout: 120_000,
		reuseExistingServer: !process.env.CI,
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{ name: "firefox", use: { ...devices["Desktop Firefox"] } },
	],
});
