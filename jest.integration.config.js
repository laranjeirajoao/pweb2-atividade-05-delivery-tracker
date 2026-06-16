export default {
	testEnvironment: "node",
	testMatch: [
		"**/tests/integration/**/*.test.js",
		"**/tests/integration/**/*.spec.js",
	],
	maxWorkers: 1,
	setupFilesAfterEnv: ["<rootDir>/tests/integration/setup.js"],
};
