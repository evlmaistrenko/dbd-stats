import { CodegenConfig } from "@graphql-codegen/cli"

import { typeDefs } from "./schema.js"

const config: CodegenConfig = {
	schema: typeDefs,
	generates: {
		"./src/types.ts": {
			plugins: ["typescript", "typescript-operations"],
		},
	},
}

export default config
