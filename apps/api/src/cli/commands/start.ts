import chalk from "chalk"
import { Command } from "commander"
import inquirer from "inquirer"
import _ from "lodash"

import { Config, config } from "../../config.js"

/** Starts GraphQL API (Apollo Server). */
export const command = new Command("start")
	.description("Starts GraphQL API (Apollo Server).")
	.option(
		"--port [number]",
		"Port to listen.",
		(value) => parseInt(value),
		config().port,
	)
	.option(
		"--mongo-main-url [string]",
		"Main MongoDB connection URL.",
		"<hidden>",
	)
	.option(
		"--mongo-main-db-name [string]",
		"Main MongoDB database name.",
		config().mongoMainDbName,
	)
	.option("--steam-api-client-key [string]", "Steam API key.", "<hidden>")
	.option("--jwt-secret [string]", "JsonWebToken secret key.", "<hidden>")
	.option(
		"--jwt-access-token-name [string]",
		"Name of JWT access token (camelCased).",
		config().jwtAccessTokenName,
	)
	.option(
		"--jwt-refresh-token-name [string]",
		"Name of JWT refresh token (camelCased).",
		config().jwtRefreshTokenName,
	)
	.option(
		"--jwt-access-token-ttl [number]",
		"TTL of access token (ms).",
		(value) => parseInt(value),
		config().jwtAccessTokenTtl,
	)
	.option(
		"--jwt-refresh-token-ttl [number]",
		"TTL of refresh token (ms).",
		(value) => parseInt(value),
		config().jwtRefreshTokenTtl,
	)
	.option(
		"--no-jwt-cookie-secure",
		"`secure` parameter of cookies with JWT-tokens will be set to `false`.",
		config().jwtCookieSecure,
	)
	.action(async (options: Partial<Config>) => {
		options = {
			...options,
			mongoMainUrl: config().mongoMainUrl,
			steamApiClientKey: config().steamApiClientKey,
			jwtSecret: config().jwtSecret,
		}
		const answers = await inquirer.prompt([
			{
				name: "port",
				type: "input",
				when: !options.port,
				message: "Port to listen",
				validate: (value) => parseInt(value).toString() === value,
			},
			{
				name: "mongoMainUrl",
				type: "password",
				mask: "*",
				when: !options.mongoMainUrl,
				message: "MongoDB connection URL",
			},
			{
				name: "mongoMainDbName",
				type: "input",
				when: !options.mongoMainDbName,
				message: "Main MongoDB database name",
			},
			{
				name: "steamApiClientKey",
				type: "password",
				mask: "*",
				when: !options.steamApiClientKey,
				message: "Steam API key",
			},
			{
				name: "jwtSecret",
				type: "password",
				mask: "*",
				when: !options.jwtSecret,
				message: "JsonWebToken secret key",
			},
			{
				name: "jwtAccessTokenName",
				type: "input",
				when: !options.jwtAccessTokenName,
				message: "Name of JWT access token (camelCased)",
				validate: (value) => value === _.camelCase(value),
			},
			{
				name: "jwtRefreshTokenName",
				type: "input",
				when: !options.jwtRefreshTokenName,
				message: "Name of JWT refresh token (camelCased)",
				validate: (value) => value === _.camelCase(value),
			},
			{
				name: "jwtAccessTokenTtl",
				type: "input",
				when: !options.jwtAccessTokenTtl,
				message: "TTL of access token (ms)",
				validate: (value) => parseInt(value).toString() === value,
			},
			{
				name: "jwtRefreshTokenTtl",
				type: "input",
				when: !options.jwtRefreshTokenTtl,
				message: "TTL of refresh token (ms)",
				validate: (value) => parseInt(value).toString() === value,
			},
		])
		if (answers.port) answers.port = parseInt(answers.port)
		if (answers.jwtAccessTokenTtl)
			answers.jwtAccessTokenTtl = parseInt(answers.jwtAccessTokenTtl)
		if (answers.jwtRefreshTokenTtl)
			answers.jwtRefreshTokenTtl = parseInt(answers.jwtRefreshTokenTtl)
		config({
			...options,
			...answers,
		})

		console.clear()
		console.info(chalk.magenta("Starting Apollo server..."))
		await import("../../bootstrap.js").then(({ bootstrap }) =>
			bootstrap(() => {
				console.clear()
				console.info(
					`🚀 ${chalk.green("Server ready at")} ${chalk.blue(`http://localhost:${config().port}/graphql`)}`,
				)
				console.info(
					`🔄 ${chalk.green("WebSocket server running on")} ${chalk.blue(`ws://localhost:${config().port}/graphql`)}`,
				)
			}),
		)
	})
