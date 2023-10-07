module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
			tsx: true,
		},
	},
	env: {
		browser: true,
		"react-native/react-native": true,
	},
	plugins: [
		"react",
		"react-native",
		"@typescript-eslint",
		"eslint-plugin-custom-rules",
	],
	settings: {
		react: {
			version: "detect",
		},
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
	],
	ignorePatterns: ["android/*", "ios/*"],
	rules: {
		"react/react-in-jsx-scope": "off",
		"react-native/no-unused-styles": 2,
		"react-native/split-platform-components": 2,
		"react-native/no-color-literals": 2,
		"react-native/no-raw-text": 2,
		"react-native/no-inline-styles": "off",
		"react-native/sort-styles": [
			"error",
			"asc",
			{
				ignoreClassNames: false,
				ignoreStyleProperties: false,
			},
		],
	},
};
