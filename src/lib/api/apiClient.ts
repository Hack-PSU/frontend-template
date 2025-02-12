// apiClient.ts
import { auth, getEnvironment } from "@/lib/config";
import { getIdToken, onIdTokenChanged } from "firebase/auth";

const config = getEnvironment();

/**
 * A wrapper around fetch() that:
 * - Fetches an auth token from Firebase, if logged in
 * - Adds `Authorization: Bearer <token>` to each request if available
 * - Automatically sets content-type = application/json if we pass a body
 * - Basic 401 handling
 */
export async function apiFetch<T>(
	url: string,
	options: RequestInit & { noAuth?: boolean } = {}
): Promise<T> {
	const { noAuth, ...fetchOptions } = options;

	// Optionally attach headers
	const headers = new Headers(fetchOptions.headers || {});
	if (!noAuth) {
		// Attempt to get token from Firebase user
		const user = auth.currentUser;
		if (user) {
			const token = await getIdToken(user);
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
		}
	}

	// If we're sending JSON, set the content type
	if (
		fetchOptions.body &&
		typeof fetchOptions.body === "string" &&
		!headers.has("Content-Type")
	) {
		headers.set("Content-Type", "application/json");
	}

	const finalUrl = `${config.baseURL}${url}`;

	const response = await fetch(finalUrl, {
		...fetchOptions,
		headers,
	});

	if (response.status === 401) {
		// Retry once if we get a 401 after 1 second
		await new Promise((resolve) => setTimeout(resolve, 1000));

		throw new Error("Unauthorized");
	}

	if (!response.ok) {
		const errorBody = await response.text();
		throw new Error(`Request failed (${response.status}): ${errorBody}`);
	}

	// Return JSON body
	return (await response.json()) as T;
}

// Listen for token changes in Firebase and do something if needed
onIdTokenChanged(auth, async (user) => {
	// e.g., you might want to force a refetch or store a new token in state
	if (user) {
		const token = await getIdToken(user);
		console.log("New Firebase ID token:", token);
	}
});
