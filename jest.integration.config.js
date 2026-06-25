export default {
	testEnvironment: "node",
	testMatch: [
		"**/tests/integration/**/*.test.js",
		"**/tests/integration/**/*.spec.js",
	],
	maxWorkers: 1,
	setupFiles: ["<rootDir>/tests/load-test-env.js"],
	setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};
