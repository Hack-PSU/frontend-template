import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { apiConfig, auth } from "@/lib/config";
import { DateTime } from "luxon";
import { getIdToken, getIdTokenResult, User } from "firebase/auth";

export type ApiAxiosInstance = AxiosInstance & {
	defaults: {
		headers: {
			exp?: string;
		};
	};
};

export type ApiAxiosRequestConfig = AxiosRequestConfig & {
	headers: {
		exp?: string;
	};
};

export const api = axios.create({
	baseURL: apiConfig.baseUrl,
}) as ApiAxiosInstance;

const shouldRefreshToken = (config: ApiAxiosRequestConfig) => {
	const token = config.headers.token;
	const expiration = config.headers.exp;
	let isExpired = true

	if (expiration) {
		isExpired = DateTime.fromISO(expiration) < DateTime.now()
	}

	return isExpired || !token || !expiration;
}

const refreshToken = async (config: ApiAxiosRequestConfig) => {
	if (!auth.currentUser) return;
	const tokenResult = await getIdTokenResult(auth.currentUser);

	if (tokenResult) {
		const { token, expirationTime } = tokenResult;
		config.headers["Authorization"] = `Bearer ${token}`;

		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		api.defaults.headers.common["exp"] = expirationTime;
	}
}

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const request = error.config;
		const isRefreshNeeded =
			shouldRefreshToken(request) &&
			error.response.status === 401 &&
			!request.__retried;

		if (isRefreshNeeded) {
			request.__retried = true;
			await refreshToken(request);
			return api(request);
		}
		return Promise.reject(error);
	}
)

export const initApi = async (user: User | null) => {
	if (user) {
		const token = await getIdToken(user);
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	}
};

export const resetApi = () => {
	delete api.defaults.headers.common["Authorization"];
	delete api.defaults.headers.common["exp"];
};
