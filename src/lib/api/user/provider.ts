import { apiFetch } from "@/lib/api/apiClient";
import { UserEntity, UserInfoMe } from "./entity";
import { RegistrationEntity } from "../registration";

export async function getAllUsers(active?: boolean): Promise<UserEntity[]> {
	const queryParam = active !== undefined ? `?active=${active}` : "";
	return apiFetch<UserEntity[]>(`/users${queryParam}`, { method: "GET" });
}

export async function getUser(id: string): Promise<UserEntity> {
	return apiFetch<UserEntity>(`/users/${id}`, { method: "GET" });
}

export async function createUser(
	data: Omit<UserEntity, "id">
): Promise<UserEntity> {
	return apiFetch<UserEntity>("/users", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateUser(
	id: string,
	data: Partial<Omit<UserEntity, "id">>
): Promise<UserEntity> {
	return apiFetch<UserEntity>(`/users/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export async function replaceUser(
	id: string,
	data: Omit<UserEntity, "id">
): Promise<UserEntity> {
	return apiFetch<UserEntity>(`/users/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
	});
}

export async function deleteUser(id: string): Promise<void> {
	return apiFetch<void>(`/users/${id}`, { method: "DELETE" });
}

export async function getUserResume(id: string): Promise<Blob> {
	return apiFetch<Blob>(`/users/${id}/resumes`, {
		method: "GET",
	});
}

export async function getUserInfoMe(): Promise<UserInfoMe> {
	return apiFetch<UserInfoMe>("/users/info/me", { method: "GET" });
}
