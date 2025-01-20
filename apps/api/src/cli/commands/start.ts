import chalk from "chalk"
import { Command } from "commander"
import inquirer from "inquirer"

import { Config, config } from "../../config.js"

export const command = new Command("start")
	.description("Starts GraphQL API (Apollo Server)")
	.option(
		"-p, --port [number]",
		"Port to listen",
		(value) => parseInt(value),
		config().port,
	)
	.option(
		"-u, --mongo-main-url [string]",
		"Main MongoDB connection URL",
		config().mongoMainUrl,
	)
	.option(
		"-n, --mongo-main-db-name [string]",
		"Main MongoDB database name",
		config().mongoMainDbName,
	)
	.option(
		"-k, --steam-api-client-key [string]",
		"Steam API key",
		config().steamApiClientKey,
	)
	.action(async (options: Partial<Config>) => {
		const answers = await inquirer.prompt([
			{
				name: "port",
				type: "input",
				when: !options.port,
				message: "Port to listen",
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
		])
		if (answers.port) answers.port = parseInt(answers.port)
		config({
			...options,
			...answers,
		})

		console.clear()
		console.info(chalk.magenta("Starting..."))
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
