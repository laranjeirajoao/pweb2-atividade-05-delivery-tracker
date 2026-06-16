// playwright.config.js
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/e2e",
	timeout: 30000, // timeout por teste: 30 segundos

	use: {
		baseURL: "http://localhost:5173", // URL do frontend (Vite dev server)
		trace: "on-first-retry", // grava trace ao retentar
		screenshot: "only-on-failure", // captura screenshot em falhas
		video: "retain-on-failure", // grava vídeo em falhas
	},

	// Executa backend e frontend antes dos testes
	webServer: [
		{
			command: "DOTENV_CONFIG_PATH=.env.test node src/server.js",
			url: "http://localhost:3000",
			reuseExistingServer: !process.env.CI,
		},
		{
			command: "npm run dev --prefix frontend",
			url: "http://localhost:5173",
			reuseExistingServer: !process.env.CI,
		},
	],

	projects: [
		{ name: "chromium", use: { ...devices["Desktop Chrome"] } },
		{ name: "firefox", use: { ...devices["Desktop Firefox"] } },
	],
});
