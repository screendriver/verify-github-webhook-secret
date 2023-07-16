export default {
	files: ["./test/unit/**/*.test.ts"],
	typescript: {
		extensions: ["ts"],
		rewritePaths: {
			"src/": "target/src/",
			"test/": "target/test/",
		},
		compile: false,
	},
};
