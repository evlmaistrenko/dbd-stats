/** @type {import("@graphql-codegen/cli").CodegenConfig} */
const config = {
	schema: "src/schema/**/*.graphql",
	generates: {
		"schema.graphql": {
			plugins: ["schema-ast"],
			config: {
				includeDirectives: true,
			},
		},
		"src/types/schema.ts": {
			plugins: ["typescript", "typescript-operations"],
		},
	},
}

export default config
