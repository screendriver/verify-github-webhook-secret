module.exports = {
	extensions: ["ts"],
	require: ["ts-node/register/transpile-only"],
	environmentVariables: {
		TS_NODE_PROJECT: "tsconfig.base.json",
	},
};
