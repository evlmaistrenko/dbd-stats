/** @type {import("lint-staged").Config} */
export default {
	"*": ["npx --no -- prettier --write --ignore-unknown", "npx --no -- eslint"],
}
