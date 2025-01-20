import { createServer } from "node:http"

import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import { makeExecutableSchema } from "@graphql-tools/schema"
import bodyParser from "body-parser"
import cors from "cors"
import express from "express"
import { useServer } from "graphql-ws/use/ws"
import { WebSocketServer } from "ws"

import { config } from "./config.js"

/**
 * Starts Apollo server
 *
 * @param listeningListener Callback executed when server is ready
 */
export async function bootstrap(listeningListener?: () => void) {
	const [{ typeDefs }, { resolvers }] = await Promise.all([
		import("./schema.js"),
		import("./resolvers/index.js"),
	])
	const schema = makeExecutableSchema({ typeDefs, resolvers })

	const app = express()
	app.use(cors())
	app.use(bodyParser.json())

	const httpServer = createServer(app)

	const wsServer = new WebSocketServer({
		server: httpServer,
		path: "/graphql",
	})

	const serverCleanup = useServer({ schema }, wsServer)

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
	app.use("/graphql", expressMiddleware(server))

	httpServer.listen(config().port, listeningListener)
}
