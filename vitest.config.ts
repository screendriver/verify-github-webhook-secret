import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			all: true,
			lines: 100,
			functions: 100,
			statements: 100,
			branches: 100,
			extension: [".ts"],
			include: ["src/**/*"],
			exclude: ["src/index.ts"],
			provider: "c8",
			reporter: ["lcov", "text-summary", "clover"],
			reportsDirectory: "./target/coverage",
		},
		threads: false,
	},
});
