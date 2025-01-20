#!/usr/bin/env node
import fs from "node:fs/promises"
import path from "node:path"

import { program } from "commander"

import { command as start } from "./commands/start.js"

const pkg = JSON.parse(
	await fs.readFile(path.join(import.meta.dirname, "../../package.json"), {
		encoding: "utf-8",
	}),
)

program.name(pkg.name).version(pkg.version).description(pkg.description)

program.addCommand(start, { isDefault: true })

await program.parseAsync()
