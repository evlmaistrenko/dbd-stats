import http from "node:http"

import { BaseContext } from "@apollo/server"
import { ExpressMiddlewareOptions } from "@apollo/server/express4"
import { Request } from "express"
import jsonWebToken from "jsonwebtoken"
import _ from "lodash"

import { config } from "./config.js"
import { types } from "./types/index.js"
import * as utilities from "./utilities/index.js"

type Arg = Parameters<
	Required<ExpressMiddlewareOptions<BaseContext>>["context"]
>[0]
type WsArg = {
	connectionParams?: Record<string, any>
	extra: { request: http.IncomingMessage }
}

/** Creates GraphQL-context for Websocket-connections. */
export async function context(arg: WsArg): Promise<types.Context>
/** Creates GraphQL-context for regular http-queries. */
export async function context(arg: Arg): Promise<types.Context>
export async function context(arg: Arg | WsArg): Promise<types.Context> {
	let result: types.Context = {}
	let request: http.IncomingMessage = (arg as Arg).req
	if (request) {
		result.request = request as Request
		result.response = (arg as Arg).res
	} else {
		request = (arg as WsArg).extra.request
	}
	const token = utilities.getToken(config().jwtAccessTokenName, request)
	if (!token) return result
	try {
		result.jwt = _.pick(
			jsonWebToken.verify(token, config().jwtSecret) as {
				userId: string
				tokenId: string
			},
			["userId", "tokenId"],
		)
	} catch (error: any) {
		if (error.name === "TokenExpiredError") {
			result.jwt = {
				..._.pick(
					jsonWebToken.decode(token) as {
						userId: string
						tokenId: string
					},
					["userId", "tokenId"],
				),
				expired: true,
			}
		}
	}
	return result
}
