import { createServer } from "node:http"

import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import { useServer } from "graphql-ws/use/ws"
import { WebSocketServer } from "ws"

import { config } from "./config.js"

/**
 * Starts Apollo server.
 *
 * @param listeningListener Callback executed when server is ready.
 */
export async function bootstrap(listeningListener?: () => void) {
	const [{ schema }, { context }] = await Promise.all([
		import("./schema/index.js"),
		import("./context.js"),
	])

	const app = express()
	app.use(cors())
	app.use(bodyParser.json())
	app.use(cookieParser())

	const httpServer = createServer(app)

	const wsServer = new WebSocketServer({
		server: httpServer,
		path: "/graphql",
	})

	const serverCleanup = useServer(
		{
			schema,
			context,
		},
		wsServer,
	)

	const server = new ApolloServer({
		schema,
		plugins: [
			{
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose()
						},
					}
				},
			},
		],
	})

	await server.start()
	app.use(
		"/graphql",
		expressMiddleware(server, {
			context,
		}),
	)

	httpServer.listen(config().port, listeningListener)
}
