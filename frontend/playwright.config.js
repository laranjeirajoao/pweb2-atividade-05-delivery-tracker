// frontend/playwright.config.js
import { defineConfig, devices } from "@playwright/test";

const PORTA_TESTE = 3001;
const BASE_URL = `http://localhost:${PORTA_TESTE}`;

export default defineConfig({
	testDir: "./tests/e2e",
	timeout: 30_000,
	reporter: [["html", { outputFolder: "./tests/e2e/reports" }]],

	outputDir: "test-results/",

	use: {
		baseURL: BASE_URL,
		screenshot: "only-on-failure",
		trace: "retain-on-failure",
	},

	webServer: {
		command: `NODE_ENV=test PORT=${PORTA_TESTE} DOTENV_CONFIG_PATH=.env.test npm run dev`,
		url: BASE_URL,
		timeout: 120_000,
		reuseExistingServer: false,
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{ name: "firefox", use: { ...devices["Desktop Firefox"] } },
	],
});
