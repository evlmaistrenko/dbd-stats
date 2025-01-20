import _ from "lodash"

import * as query from "./query.js"
import * as subscription from "./subscription.js"

type SlicedParameters<F> = F extends (arg0: any, ...rest: infer R) => any
	? R
	: never

/** To use with `graphql` function */
export const rootValue = {
	user: query.user.bind(this, [undefined]) as (
		...args: SlicedParameters<typeof query.user>
	) => ReturnType<typeof query.user>,
	stats: query.stats.bind(this, [undefined]) as (
		...args: SlicedParameters<typeof query.stats>
	) => ReturnType<typeof query.stats>,
}

/** To use with Apollo server */
export const resolvers = {
	Query: query,
	Subscription: _.mapValues(subscription, (fn) => ({
		subscribe: fn,
	})),
}
