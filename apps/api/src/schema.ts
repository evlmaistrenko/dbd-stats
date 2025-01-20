import { buildSchema } from "graphql"

export const typeDefs = /* GraphQL */ `
	type User {
		id: ID!
		steamProfile: UserSteamProfile!
	}

	type UserSteamProfile {
		steamId: String!
		nickname: String!
	}

	type UserStats {
		user: User!
		"Status X12"
		status: UserStatsStatus!
		bloodpoints: UserStatsBloodpoints
	}

	type UserStatsBloodpoints {
		total: Int!
	}

	enum UserStatsStatus {
		QUEUED
		ACTUAL
	}

	input UserStatsOptions {
		skip: Int
		limit: Int
		sort: [UserStatsSort!]
	}

	enum UserStatsSort {
		TOTAL_BLOODPOINTS_ASC
		TOTAL_BLOODPOINTS_DESC
	}

	type Query {
		user(id: ID!): User
		stats(userId: ID, options: UserStatsOptions): [UserStats]
	}

	type Subscription {
		stats(userId: ID, options: UserStatsOptions): [UserStats]
	}
`

export const schema = buildSchema(typeDefs)
