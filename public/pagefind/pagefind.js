const warning =
	"[Pagefind] Search index is missing. Returning empty results until the build step runs pagefind.";

export async function options() {
	console.warn(warning);
}

export async function search() {
	console.warn(warning);
	return { results: [] };
}

export default {
	options,
	search,
};
