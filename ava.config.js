export default {
	files: ["./test/unit/**/*.test.ts"],
	typescript: {
		rewritePaths: {
			"src/": "target/src/",
			"test/": "target/test/",
		},
		compile: false,
	},
};
