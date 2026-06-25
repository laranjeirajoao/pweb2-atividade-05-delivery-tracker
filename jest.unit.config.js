export default {
	testEnvironment: "node",
	testMatch: ["**/tests/unit/**/*.test.js", "**/tests/unit/**/*.spec.js"],
	setupFiles: ["<rootDir>/tests/load-test-env.js"],
};
