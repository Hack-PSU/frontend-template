import FormData from "form-data";
import { api } from "@/lib/api";

const VALID_GET_RESPONSE_STATUS = [200];
const VALID_POST_RESPONSE_STATUS = [201];
const VALID_DELETE_RESPONSE_STATUS = [200, 204];
const VALID_PUT_RESPONSE_STATUS = [200];
const VALID_PATCH_RESPONSE_STATUS = [200];

// Custom error class for when the API is not initialized with a Firebase user token. Can be bypassed by setting useAuth to False when making specific request.
class UninitializedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "UninitializedError";
	}
}

/* This class is a wrapper for the axios API client.
 * It provides a simple interface for making requests to the API as well as checking whether the API is initialized with a Firebase user token.
 */
export default class ApiService {
	static get isInitialized(): boolean {
		return api.defaults.headers.common["Authorization"] !== undefined;
	}

	static async get<T>(url: string, useAuth: boolean = true) {
		if (useAuth && !ApiService.isInitialized)
			throw new UninitializedError("(401) API not initialized with user token");

		try {
			const response = await api.get<T>(url);
			if (VALID_GET_RESPONSE_STATUS.includes(response.status)) {
				return response.data;
			} else {
				throw new Error("Failed to fetch data from the API");
			}
		} catch (error: any) {
			this.handleError(error);
		}
	}

	static async post<T>(url: string, data: any, useAuth: boolean = true) {
		if (useAuth && !ApiService.isInitialized)
			throw new UninitializedError("(401) API not initialized with user token");

		try {
			const response = await api.post<T>(url, data);
			if (VALID_POST_RESPONSE_STATUS.includes(response.status)) {
				// 201 - Created
				return response.data;
			} else {
				throw new Error("Failed to create resource");
			}
		} catch (error: any) {
			this.handleError(error);
		}
	}

	static async delete<T>(url: string, useAuth: boolean = true) {
		if (useAuth && !ApiService.isInitialized)
			throw new UninitializedError("(401) API not initialized with user token");

		try {
			const response = await api.delete<T>(url);

			if (VALID_DELETE_RESPONSE_STATUS.includes(response.status)) {
				// 204 - No Content = Success
				return;
			} else {
				throw new Error("Failed to delete resource");
			}
		} catch (error: any) {
			this.handleError(error);
		}
	}

	static async put<T>(url: string, data: any, useAuth: boolean = true) {
		if (useAuth && !ApiService.isInitialized)
			throw new UninitializedError("(401) API not initialized with user token");

		try {
			// PUT uses form data, so we take JSON as input and convert it here
			const formData = new FormData();
			for (const key in data) {
				if (key !== "id") {
					formData.append(key, data[key]);
				}
			}

			// Specify form data in headers
			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};

			const response = await api.put<T>(url, formData, config);
			if (VALID_PUT_RESPONSE_STATUS.includes(response.status)) {
				return response.data;
			} else {
				throw new Error("Failed to update resource");
			}
		} catch (error: any) {
			this.handleError(error);
		}
	}

	static async patch<T>(url: string, data: any, useAuth: boolean = true) {
		if (useAuth && !ApiService.isInitialized)
			throw new UninitializedError("(401) API not initialized with user token");

		try {
			// PATCH uses form data, so we take JSON as input and convert it here
			const formData = new FormData();
			for (const key in data) {
				if (key !== "id") {
					formData.append(key, data[key]);
				}
			}

			// Specify form data in headers
			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};

			const response = await api.patch<T>(url, formData, config);
			if (VALID_PATCH_RESPONSE_STATUS.includes(response.status)) {
				return response.data;
			} else {
				throw new Error("Failed to update resource");
			}
		} catch (error: any) {
			this.handleError(error);
		}
	}

	private static handleError(error: any) {
		if (error.response.data.message) {
			if (Array.isArray(error.response.data.message)) {
				throw new Error(error.response.data.message.join(", "));
			} else {
				throw new Error(error.response.data.message);
			}
		} else throw new Error(`Error: ${error.message}`);
	}
}
