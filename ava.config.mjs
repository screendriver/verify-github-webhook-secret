export default {
	files: ["./test/unit/**/*.test.ts"],
	extensions: {
		ts: "module",
	},
	nodeArguments: ["--no-warnings", "--loader=tsx"],
};
