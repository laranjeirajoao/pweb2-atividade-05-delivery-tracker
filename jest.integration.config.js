export default {
	testEnvironment: "node",
	testMatch: [
		"**/tests/integration/**/*.test.js",
		"**/tests/integration/**/*.spec.js",
	],
	setupFilesAfterEnv: ["<rootDir>/tests/integration/setup.js"],
};
