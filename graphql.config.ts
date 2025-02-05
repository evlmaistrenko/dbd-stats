export default {
	schema: "./apps/api/schema.graphql",
	documents: [
		"packages/src/**/*.{graphql,js,ts,jsx,tsx}",
		"packages/test/**/*.{graphql,js,ts,jsx,tsx}",
		"apps/src/**/*.{graphql,js,ts,jsx,tsx}",
		"apps/test/**/*.{graphql,js,ts,jsx,tsx}",
	],
}
