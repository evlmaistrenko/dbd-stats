import { config as getConfig } from "../config.js"

export const config = {
	...getConfig({
		mongoMainDbName:
			"apiTest_" +
			Array.from(
				globalThis.crypto.getRandomValues(new Uint8Array(10)),
				(byte) => byte.toString(16).padStart(2, "0"),
			).join(""),
	}),
	tests: {
		accounts: {
			users: {
				skip: false,
			},
		},
		access: {
			skip: false,
		},
	},
}

export const { graphql, subscribe, mongo } = await import("../index.js")

export { types } from "../types/index.js"
