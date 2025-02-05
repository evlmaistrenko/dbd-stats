import fs from "node:fs/promises"
import path from "node:path"

import { makeExecutableSchema } from "@graphql-tools/schema"
import { MapperKind, getDirective, mapSchema } from "@graphql-tools/utils"
import { GraphQLEnumType, GraphQLError, ListValueNode } from "graphql"
import _ from "lodash"

import { resolvers } from "../resolvers/index.js"
import { types } from "../types/index.js"

const typeDefs = await fs.readFile(
	path.join(import.meta.dirname, "../../schema.graphql"),
	{ encoding: "utf-8" },
)

/** GraphQL-schema */
let schema = makeExecutableSchema({ typeDefs, resolvers })

schema = mapSchema(schema, {
	[MapperKind.OBJECT_FIELD]: (fieldConfig) => {
		const access = getDirective(schema, fieldConfig, "access")?.[0] as
			| { owner: types.OwnerAccess; can: types.Permissions }
			| undefined
		if (!access) return fieldConfig
		;(["resolve", "subscribe"] as ("resolve" | "subscribe")[]).forEach(
			(functionName) => {
				const originalFunction = fieldConfig[functionName]
				if (!originalFunction) return
				fieldConfig[functionName] = async (
					source,
					args,
					context: types.Context,
					info,
				) => {
					if (context.jwt) {
						if (access.owner && args.userId === context.jwt.userId) {
							if (
								!context.jwt.expired ||
								access.owner === types.OwnerAccess.MaybeExpired
							) {
								return originalFunction(source, args, context, info)
							} else {
								throw new GraphQLError("Access token is expired.", {
									extensions: { code: types.ErrorCode.Unauthorized },
								})
							}
						}
						const { permissions } = await resolvers.Query.user(null, {
							userId: context.jwt.userId,
						})
						if (permissions.filter(Boolean).includes(access.can))
							return originalFunction(source, args, context, info)
						throw new GraphQLError(
							"You are not permitted to execute this query.",
							{
								extensions: { code: types.ErrorCode.AccessDenied },
							},
						)
					}
					throw new GraphQLError("This action requires authentication.", {
						extensions: { code: types.ErrorCode.Unauthorized },
					})
				}
			},
		)
		return fieldConfig
	},
})

export { schema }

/** Permissions indexed by roles. */
export const permissions = (schema.getType("Roles") as GraphQLEnumType)
	.getValues()
	.reduce(
		(permissions, role) => {
			const args = role.astNode?.directives?.find(
				(d) => d.name.value === "can",
			)?.arguments
			const roleName = role.name as types.Roles
			if (!args) permissions[roleName] = Object.values(types.Permissions)
			else {
				try {
					// @ts-ignore
					permissions[roleName] = args
						.find((arg) => arg.name.value === "list")
						// @ts-ignore
						.value.values.map(({ value }: { value: string }) => value)
				} catch {}
			}
			return permissions
		},
		{} as Record<types.Roles, types.Permissions[]>,
	)
