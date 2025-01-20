import * as timers from "node:timers/promises"

import _ from "lodash"
import { ChangeStreamDocument } from "mongodb"

import * as main from "./main/index.js"

type AnyDocument = main.StatsDocument | main.StatsUpdateQueueDocument

const stream = main.db.watch([
	{
		$match: {
			"ns.coll": {
				$in: [main.stats.collectionName, main.statsUpdateQueue.collectionName],
			},
		},
	},
])
const triggers: PromiseWithResolvers<ChangeStreamDocument<AnyDocument>>[] = []
const fulfill = (error?: Error, value?: ChangeStreamDocument<AnyDocument>) => {
	let trigger
	while ((trigger = triggers.shift())) {
		if (error) trigger.reject(error)
		else if (value) trigger.resolve(value)
	}
}

stream
	.on(
		"change",
		_.throttle((change) => fulfill(undefined, change), 1000),
	)
	.on("error", (error) => fulfill(error))
	.on("close", () => fulfill(new Error("`stream` unexpectedly closed")))
	.on("end", () => fulfill(new Error("`stream` unexpectedly end")))

const trigger: () => Promise<ChangeStreamDocument<AnyDocument>> = () => {
	const result = Promise.withResolvers<any>()
	if (stream.closed) result.reject(new Error("`stream` is closed"))
	else triggers.push(result)
	return result.promise
}

export async function* subscribe<T extends () => Promise<any> | any>(
	fn: T,
): AsyncGenerator<Awaited<ReturnType<T>>> {
	let previous
	let promise
	let value
	let symbol = Symbol()
	do {
		if (value === symbol) continue
		else promise = trigger()
		const next = await fn()
		if (_.isEqual(next, previous)) continue
		promise.catch(() => {})
		yield (previous = next)
	} while (
		(value = await Promise.race([
			promise,
			timers.setTimeout(1000).then(() => symbol),
		]))
	)
}
