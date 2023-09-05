import { api } from "@/lib/api/axios";

const VALID_GET_RESPONSE_STATUS = [200];
const VALID_POST_RESPONSE_STATUS = [201];
const VALID_DELETE_RESPONSE_STATUS = [204];
const VALID_PUT_RESPONSE_STATUS = [200];
const VALID_PATCH_RESPONSE_STATUS = [200];

export default class ApiService {
	static get isInitialized(): boolean {
		return api.defaults.headers.common["Authorization"] !== undefined;
	}

	static async get<T>(url: string) {
		if (!ApiService.isInitialized)
			throw new Error("(401) api not initialized with user token");

		try {
			const response = await api.get<T>(url);
			if (VALID_GET_RESPONSE_STATUS.includes(response.status)) {
				return response.data;
			} else {
				throw new Error("Failed to fetch data from the API");
			}
		} catch (error: any) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	static async post<T>(url: string, data: any) {
		if (!ApiService.isInitialized)
			throw new Error("(401) api not initialized with user token");

		try {
			const response = await api.post<T>(url, data);

			if (VALID_POST_RESPONSE_STATUS.includes(response.status)) {
				// 201 - Created
				return response.data;
			} else {
				throw new Error("Failed to create resource");
			}
		} catch (error: any) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	static async delete<T>(url: string) {
		if (!ApiService.isInitialized)
			throw new Error("(401) api not initialized with user token");

		try {
			const response = await api.delete<T>(url);

			if (VALID_DELETE_RESPONSE_STATUS.includes(response.status)) {
				// 204 - No Content = Success
				return;
			} else {
				throw new Error("Failed to delete resource");
			}
		} catch (error: any) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	static async put<T>(url: string, data: any) {
		if (!ApiService.isInitialized)
			throw new Error("(401) api not initialized with user token");

		try {
			const response = await api.put<T>(url, data);
			if (VALID_PUT_RESPONSE_STATUS.includes(response.status)) {
				return response.data;
			} else {
				throw new Error("Failed to update resource");
			}
		} catch (error: any) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	static async patch<T>(url: string, data: any) {
		if (!ApiService.isInitialized)
			throw new Error("(401) api not initialized with user token");

		try {
			const response = await api.patch<T>(url, data);
			if (VALID_PATCH_RESPONSE_STATUS.includes(response.status)) {
				return response.data;
			} else {
				throw new Error("Failed to update resource");
			}
		} catch (error: any) {
			throw new Error(`Error: ${error.message}`);
		}
	}
}
