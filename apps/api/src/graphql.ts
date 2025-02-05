import {
	ExecutionArgs,
	ExecutionResult,
	GraphQLArgs,
	graphql as graphqlRaw,
	parse,
	subscribe as subscribeRaw,
} from "graphql"
import _ from "lodash"

import { schema } from "./schema/index.js"
import { types } from "./types/index.js"

/** Combined operations results. */
export type Operations = NonNullable<
	Omit<types.Query, "__typename"> &
		Omit<types.Subscription, "__typename"> &
		Omit<types.Mutation, "__typename">
>

/** Customized `graphql` function. */
export function graphql(
	args: Omit<GraphQLArgs, "rootValue" | "schema">,
): Promise<ExecutionResult<Operations>> {
	return graphqlRaw({ ...args, schema }) as Promise<ExecutionResult<Operations>>
}

/** Customized `subscribe` function. */
export async function* subscribe(
	args: Omit<ExecutionArgs, "rootValue" | "schema" | "document"> & {
		source: GraphQLArgs["source"]
	},
): AsyncGenerator<ExecutionResult<Operations>> {
	const { source, ...rest } = args
	const value: any = await subscribeRaw({
		...rest,
		schema,
		document: parse(source),
	})
	if (value[Symbol.asyncIterator]) {
		yield* value
	} else {
		yield value
	}
}
