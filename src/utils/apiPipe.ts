import { api } from "@/lib/api/axios";
import { AxiosResponse } from "axios";

type ApiResponse<T> = {
	data: T;
};

export default class Api {
	static async get<T>(url: string): Promise<ApiResponse<T>> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await api.get(url);

			if (response.status === 200) {
				return response.data;
			} else {
				throw new Error("Failed to fetch data from the API");
			}
		} catch (error: any) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	static async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await api.post(url, data);

			if (response.status === 201) {
				// 201 - Created
				return response.data;
			} else {
				throw new Error("Failed to create resource");
			}
		} catch (error: any) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	static async delete<T>(url: string): Promise<void> {
		try {
			const response: AxiosResponse<void> = await api.delete(url);

			if (response.status === 204) {
				// 204 - No Content = Success
				return;
			} else {
				throw new Error("Failed to delete resource");
			}
		} catch (error: any) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	static async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await api.put(url, data);
			if (response.status === 200) {
				return response.data;
			} else {
				throw new Error("Failed to update resource");
			}
		} catch (error: any) {
			throw new Error(`Error: ${error.message}`);
		}
	}

	static async patch<T>(url: string, data: any): Promise<ApiResponse<T>> {
		try {
			const response: AxiosResponse<ApiResponse<T>> = await api.patch(
				url,
				data
			);
			if (response.status === 200) {
				return response.data;
			} else {
				throw new Error("Failed to update resource");
			}
		} catch (error: any) {
			throw new Error(`Error: ${error.message}`);
		}
	}
}
