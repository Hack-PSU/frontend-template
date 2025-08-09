import { apiFetch } from "@/lib/api/apiClient";
import {
	TeamRosterEntity,
	TeamRosterWithUser,
	TeamsOverviewItem,
	CreateTeamRequest,
	AddMemberRequest,
	ChangeLeadRequest,
	TransferUserRequest,
	RenameTeamRequest,
} from "./entity";

export async function createTeam(
	data: CreateTeamRequest
): Promise<TeamRosterEntity> {
	return apiFetch<TeamRosterEntity>("/teams/create", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}

export async function addMember(
	data: AddMemberRequest
): Promise<TeamRosterEntity> {
	return apiFetch<TeamRosterEntity>("/teams/add-member", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}

export async function changeLead(data: ChangeLeadRequest): Promise<void> {
	return apiFetch<void>("/teams/change-lead", {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}

export async function removeMember(userId: string): Promise<void> {
	return apiFetch<void>(`/teams/remove-member/${userId}`, {
		method: "DELETE",
	});
}

export async function transferUser(
	data: TransferUserRequest
): Promise<TeamRosterEntity> {
	return apiFetch<TeamRosterEntity>("/teams/transfer-user", {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}

export async function renameTeam(data: RenameTeamRequest): Promise<void> {
	return apiFetch<void>("/teams/rename", {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}

export async function deleteTeam(teamId: string): Promise<void> {
	return apiFetch<void>(`/teams/${teamId}`, {
		method: "DELETE",
	});
}

export async function getUserTeam(
	userId: string
): Promise<TeamRosterWithUser | null> {
	return apiFetch<TeamRosterWithUser | null>(`/teams/user/${userId}`, {
		method: "GET",
	});
}

export async function getMyTeam(): Promise<TeamRosterWithUser | null> {
	return apiFetch<TeamRosterWithUser | null>("/teams/user/me", {
		method: "GET",
	});
}

export async function getTeamRoster(
	teamId: string
): Promise<TeamRosterWithUser[]> {
	return apiFetch<TeamRosterWithUser[]>(`/teams/roster/${teamId}`, {
		method: "GET",
	});
}

export async function getTeamsOverview(): Promise<TeamsOverviewItem[]> {
	return apiFetch<TeamsOverviewItem[]>("/teams/overview", {
		method: "GET",
	});
}
