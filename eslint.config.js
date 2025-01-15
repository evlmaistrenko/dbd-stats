import prettier from "eslint-plugin-prettier/recommended"

/** @type {import("eslint").Linter.Config[]} */
export default [
	prettier,
	{
		ignores: ["**/dist/"],
	},
]
