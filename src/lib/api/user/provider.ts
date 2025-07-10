// src/common/api/user/provider.ts
import { apiFetch } from "@/lib/api/apiClient";
import { UserCreateEntity, UserEntity, UserInfoMe } from "./entity";

function isFile(x: any): x is File {
	return typeof File !== "undefined" && x instanceof File;
}

function makeFormData(data: Record<string, any>) {
	const fd = new FormData();
	for (const [k, v] of Object.entries(data)) {
		if (v == null) continue;
		if (isFile(v)) {
			fd.append(k, v);
		} else {
			fd.append(k, String(v));
		}
	}
	return fd;
}

export async function getAllUsers(active?: boolean): Promise<UserEntity[]> {
	const qp = active !== undefined ? `?active=${active}` : "";
	return apiFetch<UserEntity[]>(`/users${qp}`, { method: "GET" });
}

export async function getUser(id: string): Promise<UserEntity> {
	return apiFetch<UserEntity>(`/users/${id}`, { method: "GET" });
}

export async function createUser(
	data: Omit<UserEntity, "id"> & { resume?: File }
): Promise<UserEntity> {
	const hasFile = isFile(data.resume);
	const body = hasFile ? makeFormData(data) : JSON.stringify(data);
	const headers = hasFile ? undefined : { "Content-Type": "application/json" };
	return apiFetch<UserEntity>("/users", {
		method: "POST",
		body,
		headers,
	});
}

export async function updateUser(
	id: string,
	data: Partial<Omit<UserEntity, "id">> & { resume?: File | null }
): Promise<UserEntity> {
	const hasFile = isFile(data.resume);
	const body = hasFile ? makeFormData(data) : JSON.stringify(data);
	const headers = hasFile ? undefined : { "Content-Type": "application/json" };
	return apiFetch<UserEntity>(`/users/${id}`, {
		method: "PATCH",
		body,
		headers,
	});
}

export async function replaceUser(
	id: string,
	data: Omit<UserEntity, "id" | "resume"> & { resume?: File | null | undefined }
): Promise<UserEntity> {
	const hasFile = isFile(data.resume);
	const body = hasFile ? makeFormData(data) : JSON.stringify(data);
	const headers = hasFile ? undefined : { "Content-Type": "application/json" };
	return apiFetch<UserEntity>(`/users/${id}`, {
		method: "PUT",
		body,
		headers,
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
