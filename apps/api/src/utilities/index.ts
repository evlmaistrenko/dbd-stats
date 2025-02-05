import http from "node:http"

import _ from "lodash"

/**
 * Retrieves token value from request-url, headers or cookies.
 *
 * @param name Token's name.
 * @param request Client request.
 * @returns Token value.
 */
export function getToken(
	name: string,
	request?: Partial<http.IncomingMessage>,
): string | undefined {
	if (request?.url) {
		const value = new URL(request.url, "https://host").searchParams.get(name)
		if (value) return value
	}
	return (
		request?.headers?.[`x-${_.kebabCase(name)}`] ??
		Object.fromEntries(
			request?.headers?.["cookie"]
				?.split("; ")
				.map((cookie) => cookie.split("=")) ?? [],
		)[name]
	)
}
