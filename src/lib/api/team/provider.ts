import { apiFetch } from "@/lib/api/apiClient";
import {
	TeamEntity,
	TeamCreateEntity,
	TeamUpdateEntity,
	AddUserByEmailEntity,
} from "./entity";

export async function getAllTeams(): Promise<TeamEntity[]> {
	return apiFetch<TeamEntity[]>("/teams", { method: "GET" });
}

export async function getTeam(id: string): Promise<TeamEntity> {
	return apiFetch<TeamEntity>(`/teams/${id}`, { method: "GET" });
}

export async function createTeam(data: TeamCreateEntity): Promise<TeamEntity> {
	return apiFetch<TeamEntity>("/teams", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}

export async function updateTeam(
	id: string,
	data: TeamUpdateEntity
): Promise<TeamEntity> {
	return apiFetch<TeamEntity>(`/teams/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}

export async function addUserToTeamByEmail(
	id: string,
	data: AddUserByEmailEntity
): Promise<TeamEntity> {
	return apiFetch<TeamEntity>(`/teams/${id}/add-user`, {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}
