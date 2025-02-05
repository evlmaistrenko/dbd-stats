import http from "node:http"

import { Response } from "express"

export * from "./schema.js"

/** GraphQL-context. */
export type Context = {
	/** Client request. */
	request?: http.IncomingMessage
	/** Server response. */
	response?: Response
	/** Decoded JWT access token. */
	jwt?: {
		/** Associated user's ID. */
		userId: string
		/** Tokens pair ID. */
		tokenId: string
		/** If access token expired. */
		expired?: true
	}
}

/** Custom error codes. */
export enum ErrorCode {
	Unauthorized = "UNAUTHORIZED",
	AccessDenied = "ACCESS_DENIED",
}
