// src/common/api/registration/provider.ts
import { apiFetch } from "@/lib/api/apiClient";
import {
	RegistrationEntity,
	RegistrationCreateEntity,
	RegistrationUpdateEntity,
} from "./entity";

/**
 * Note: your NestJS app only exposes:
 *  - POST /users/:id/register        → create a new registration
 *  - (optionally) a RegistrationController at /registrations for CRUD
 */

export async function getAllRegistrations(
	all?: boolean
): Promise<RegistrationEntity[]> {
	const qp = all ? "?all=true" : "";
	return apiFetch<RegistrationEntity[]>(`/registrations${qp}`, {
		method: "GET",
	});
}

export async function getRegistration(id: string): Promise<RegistrationEntity> {
	return apiFetch<RegistrationEntity>(`/registrations/${id}`, {
		method: "GET",
	});
}

export async function createRegistration(
	userId: string,
	data: RegistrationCreateEntity
): Promise<RegistrationEntity> {
	return apiFetch<RegistrationEntity>(`/users/${userId}/register`, {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}

export async function updateRegistration(
	id: string,
	data: RegistrationUpdateEntity
): Promise<RegistrationEntity> {
	return apiFetch<RegistrationEntity>(`/registrations/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}

export async function replaceRegistration(
	id: string,
	data: RegistrationCreateEntity
): Promise<RegistrationEntity> {
	return apiFetch<RegistrationEntity>(`/registrations/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}

export async function deleteRegistration(id: string): Promise<void> {
	return apiFetch<void>(`/registrations/${id}`, {
		method: "DELETE",
	});
}
