import { baseConfig } from "@enormora/eslint-config-base";
import { mochaConfig } from "@enormora/eslint-config-mocha";
import { nodeConfig, nodeConfigFileConfig } from "@enormora/eslint-config-node";
import { typescriptConfig } from "@enormora/eslint-config-typescript";

export default [
	{
		ignores: ["target/**/*", "mocha.config.json"]
	},
	baseConfig,
	nodeConfig,
	{
		...typescriptConfig,
		files: ["**/*.ts"]
	},
	{
		...mochaConfig,
		files: ["test/**/*.ts"]
	},
	{
		...nodeConfigFileConfig,
		files: ["eslint.config.js"]
	},
	{
		files: ["**/*.ts"],
		rules: {
			"@stylistic/indent": ["error", "tab"],
			"@stylistic/no-tabs": "off",
			"@stylistic/quotes": "off",
			"@stylistic/comma-dangle": "off",
			"@typescript-eslint/explicit-function-return-type": [
				"error",
				{
					allowExpressions: true,
					allowTypedFunctionExpressions: true
				}
			],
			"@typescript-eslint/strict-boolean-expressions": "off",
			"functional/prefer-immutable-types": "off",
			"id-length": "off",
			"import/no-default-export": "off",
			"init-declarations": "off"
		}
	},
	{
		files: ["test/**/*.ts"],
		rules: {
			"@typescript-eslint/no-shadow": "off",
			"max-statements": "off",
			"mocha/no-global-tests": "off",
			"mocha/no-mocha-arrows": "off"
		}
	},
	{
		files: ["eslint.config.js"],
		rules: {
			"@stylistic/no-tabs": "off",
			"@stylistic/indent": "off",
			"@stylistic/quotes": "off",
			"@stylistic/comma-dangle": "off",
			"import/no-commonjs": "off",
			"import/extensions": "off",
			"no-undef": "off"
		}
	}
];
