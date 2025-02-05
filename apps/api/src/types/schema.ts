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

/** Represents a JWT (JSON Web Token) for authentication and session management. */
export type Jwt = {
	__typename?: "Jwt"
	/** Token used to access protected resources. */
	accessToken: Scalars["String"]["output"]
	/** Token used to refresh the JWT session when it expires. */
	refreshToken: Scalars["String"]["output"]
	/** ID of the user associated with this token. */
	userId: Scalars["ID"]["output"]
}

export type Mutation = {
	__typename?: "Mutation"
	/**
	 * Revokes one or more JWT sessions for a user. Requires `MANAGE_ACCOUNTS` permission or strict
	 * ownership.
	 */
	declineJwt: Scalars["Boolean"]["output"]
	/**
	 * Links a Steam account to the specified user. Requires `MANAGE_ACCOUNTS` permission or strict
	 * ownership.
	 */
	linkSteamAccount: Scalars["Boolean"]["output"]
	/** Refreshes an expired or active JWT session. Requires `MAYBE_EXPIRED` ownership validation. */
	refreshJwt: Jwt
	/** Authenticates a user via Steam OpenID. If the user does not exist, a new account is created. */
	signJwtViaSteam: Jwt
	/**
	 * Unlinks a Steam account from the specified user. Requires `MANAGE_ACCOUNTS` permission or strict
	 * ownership.
	 */
	unlinkSteamAccount: Scalars["Boolean"]["output"]
	/** Fetches the latest account data from the Steam API. Requires `MANAGE_ACCOUNTS` permission. */
	updateSteamAccount: Scalars["Boolean"]["output"]
	/**
	 * Updates the settings of a linked Steam account. Requires `MANAGE_ACCOUNTS` permission or strict
	 * ownership.
	 */
	updateSteamAccountSettings: Scalars["Boolean"]["output"]
	/**
	 * Updates user settings such as theme preferences. Requires `MANAGE_ACCOUNTS` permission or strict
	 * ownership.
	 */
	updateUserSettings: Scalars["Boolean"]["output"]
}

export type MutationDeclineJwtArgs = {
	sessions?: InputMaybe<Array<Scalars["ID"]["input"]>>
	userId: Scalars["ID"]["input"]
}

export type MutationLinkSteamAccountArgs = {
	privacy?: InputMaybe<SteamPrivacy>
	signedUrl: Scalars["String"]["input"]
	userId: Scalars["ID"]["input"]
}

export type MutationRefreshJwtArgs = {
	userId: Scalars["ID"]["input"]
}

export type MutationSignJwtViaSteamArgs = {
	privacy?: InputMaybe<SteamPrivacy>
	signedUrl: Scalars["String"]["input"]
}

export type MutationUnlinkSteamAccountArgs = {
	accountId: Scalars["ID"]["input"]
	userId: Scalars["ID"]["input"]
}

export type MutationUpdateSteamAccountArgs = {
	accountId: Scalars["ID"]["input"]
}

export type MutationUpdateSteamAccountSettingsArgs = {
	accountId: Scalars["ID"]["input"]
	privacy?: InputMaybe<SteamPrivacy>
	userId: Scalars["ID"]["input"]
}

export type MutationUpdateUserSettingsArgs = {
	theme?: InputMaybe<Theme>
	userId: Scalars["ID"]["input"]
}

/** Defines additional conditions for ownership verification. */
export enum OwnerAccess {
	/** Allows access even if the access token may be expired. */
	MaybeExpired = "MAYBE_EXPIRED",
	/** Requires strict ownership verification. */
	Strict = "STRICT",
}

/** Defines permissions available within the system. */
export enum Permissions {
	/** Allows modification of account information. */
	ManageAccounts = "MANAGE_ACCOUNTS",
	/** Allows reading of account information. */
	ReadAccounts = "READ_ACCOUNTS",
}

export type Query = {
	__typename?: "Query"
	/**
	 * Retrieves account details for a specified user. Requires `READ_ACCOUNTS` permission or strict
	 * ownership.
	 */
	user: User
}

export type QueryUserArgs = {
	userId: Scalars["ID"]["input"]
}

/** Defines user roles and their associated permissions. */
export enum Roles {
	/** Manages accounts with read and modify permissions. */
	AccountsManager = "ACCOUNTS_MANAGER",
	/** Administrator role with full account management permissions. */
	Administrator = "ADMINISTRATOR",
	/** Superuser with unrestricted access. */
	Superuser = "SUPERUSER",
}

export type SteamAccount = {
	__typename?: "SteamAccount"
	/** Unique identifier. */
	id: Scalars["ID"]["output"]
	/** Steam nickname. */
	nickname?: Maybe<Scalars["String"]["output"]>
	settings: SteamAccountSettings
	/** 64-bit Steam ID. */
	steamId: Scalars["ID"]["output"]
}

export type SteamAccountSettings = {
	__typename?: "SteamAccountSettings"
	/** Visibility settings. */
	privacy: SteamPrivacy
}

export enum SteamPrivacy {
	Private = "PRIVATE",
	Public = "PUBLIC",
}

export type Subscription = {
	__typename?: "Subscription"
	/**
	 * Subscribes to updates on user account details. Requires `READ_ACCOUNTS` permission or strict
	 * ownership.
	 */
	user: User
}

export type SubscriptionUserArgs = {
	userId: Scalars["ID"]["input"]
}

export enum Theme {
	CondensedDark = "CONDENSED_DARK",
	CondensedDevice = "CONDENSED_DEVICE",
	CondensedLight = "CONDENSED_LIGHT",
	Dark = "DARK",
	Device = "DEVICE",
	Light = "LIGHT",
}

export type User = {
	__typename?: "User"
	/** Unique identifier. */
	id: Scalars["ID"]["output"]
	/** List of granted permissions. */
	permissions: Array<Maybe<Permissions>>
	/** List of assigned roles. */
	roles: Array<Maybe<Roles>>
	/** User settings. */
	settings: UserSettings
	/** Linked Steam accounts. */
	steam: Array<Maybe<SteamAccount>>
}

export type UserSettings = {
	__typename?: "UserSettings"
	/** Layout theme. */
	theme: Theme
}
