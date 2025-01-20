export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
	[K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
	[SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
	T extends { [key: string]: unknown },
	K extends keyof T,
> = { [_ in K]?: never }
export type Incremental<T> =
	| T
	| {
			[P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never
	  }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string }
	String: { input: string; output: string }
	Boolean: { input: boolean; output: boolean }
	Int: { input: number; output: number }
	Float: { input: number; output: number }
}

export type Query = {
	__typename?: "Query"
	stats?: Maybe<Array<Maybe<UserStats>>>
	user?: Maybe<User>
}

export type QueryStatsArgs = {
	options?: InputMaybe<UserStatsOptions>
	userId?: InputMaybe<Scalars["ID"]["input"]>
}

export type QueryUserArgs = {
	id: Scalars["ID"]["input"]
}

export type Subscription = {
	__typename?: "Subscription"
	stats?: Maybe<Array<Maybe<UserStats>>>
}

export type SubscriptionStatsArgs = {
	options?: InputMaybe<UserStatsOptions>
	userId?: InputMaybe<Scalars["ID"]["input"]>
}

export type User = {
	__typename?: "User"
	id: Scalars["ID"]["output"]
	steamProfile: UserSteamProfile
}

export type UserStats = {
	__typename?: "UserStats"
	bloodpoints?: Maybe<UserStatsBloodpoints>
	/** Status X12 */
	status: UserStatsStatus
	user: User
}

export type UserStatsBloodpoints = {
	__typename?: "UserStatsBloodpoints"
	total: Scalars["Int"]["output"]
}

export type UserStatsOptions = {
	limit?: InputMaybe<Scalars["Int"]["input"]>
	skip?: InputMaybe<Scalars["Int"]["input"]>
	sort?: InputMaybe<Array<UserStatsSort>>
}

export enum UserStatsSort {
	TotalBloodpointsAsc = "TOTAL_BLOODPOINTS_ASC",
	TotalBloodpointsDesc = "TOTAL_BLOODPOINTS_DESC",
}

export enum UserStatsStatus {
	Actual = "ACTUAL",
	Queued = "QUEUED",
}

export type UserSteamProfile = {
	__typename?: "UserSteamProfile"
	nickname: Scalars["String"]["output"]
	steamId: Scalars["String"]["output"]
}
