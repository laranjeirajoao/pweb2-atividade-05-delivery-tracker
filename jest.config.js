// jest.config.js
export default {
	testEnvironment: "node",
	transform: {}, // sem transpilação — Node nativo com ESM
	testMatch: ["**/__tests__/**/*.test.js", "**/*.spec.js"],
	collectCoverageFrom: [
		"src/**/*.js",
		"!src/config/**", // exclui arquivos de configuração
		"!src/server.js", // exclui ponto de entrada
	],
	coverageThreshold: {
		global: {
			statements: 80,
			branches: 75,
			functions: 80,
			lines: 80,
		},
	},
	setupFiles: ["dotenv/config"],
	setupFilesAfterEnv: ["./tests/setup.js"],
};
