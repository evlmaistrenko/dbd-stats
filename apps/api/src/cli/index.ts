#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"

import chalk from "chalk"
import { program } from "commander"
import figlet from "figlet"

import { command as start } from "./commands/start.js"

const pkg = JSON.parse(
	await fs.readFile(path.join(import.meta.dirname, "../../package.json"), {
		encoding: "utf-8",
	}),
)

console.info(
	"\n" +
		chalk.blue(
			await new Promise((resolve, reject) =>
				figlet(
					pkg.name.split("/").reverse()[0],
					(error: Error | null, result?: string) =>
						error ? reject(error) : resolve(result),
				),
			),
		) +
		"\n\n",
)

program.name(pkg.name).version(pkg.version).description(pkg.description)

program.addCommand(start, { isDefault: true })

await program.parseAsync()
