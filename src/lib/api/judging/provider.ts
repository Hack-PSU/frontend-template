import { apiFetch } from "@/lib/api/apiClient";
import {
	ScoreEntity,
	ScoreCreateEntity,
	ScoreUpdateEntity,
	ProjectEntity,
	ProjectCreateEntity,
	ProjectPatchEntity,
	ProjectBreakdownEntity,
	JudgingAssignmentEntity,
} from "./entity";

export async function getAllScores(): Promise<ScoreEntity[]> {
	return apiFetch<ScoreEntity[]>("/judging/scores", { method: "GET" });
}

export async function getScore(id: number): Promise<ScoreEntity> {
	return apiFetch<ScoreEntity>(`/judging/scores/${id}`, { method: "GET" });
}

export async function createScore(
	data: ScoreCreateEntity
): Promise<ScoreEntity> {
	return apiFetch<ScoreEntity>("/judging/scores", {
		method: "POST",
		body: JSON.stringify(data),
	});
}

export async function updateScore(
	id: number,
	data: ScoreUpdateEntity
): Promise<ScoreEntity> {
	return apiFetch<ScoreEntity>(`/judging/scores/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
	});
}

export async function deleteScore(id: number): Promise<void> {
	return apiFetch<void>(`/judging/scores/${id}`, { method: "DELETE" });
}

export async function getAllProjects(): Promise<ProjectEntity[]> {
	return apiFetch<ProjectEntity[]>("/judging/projects", { method: "GET" });
}

export async function createProject(
	data: ProjectCreateEntity
): Promise<ProjectEntity> {
	return apiFetch<ProjectEntity>("/judging/projects", {
		method: "POST",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}

export async function getProject(id: number): Promise<ProjectEntity> {
	return apiFetch<ProjectEntity>(`/judging/projects/${id}`, { method: "GET" });
}

export async function getProjectsByTeamId(
	teamId: string
): Promise<ProjectEntity[]> {
	return apiFetch<ProjectEntity[]>(`/judging/projects/team/${teamId}`, {
		method: "GET",
	});
}

export async function patchProject(
	id: number,
	data: ProjectPatchEntity
): Promise<ProjectEntity> {
	return apiFetch<ProjectEntity>(`/judging/projects/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}

export async function replaceProject(
	id: number,
	data: ProjectCreateEntity
): Promise<ProjectEntity> {
	return apiFetch<ProjectEntity>(`/judging/projects/${id}`, {
		method: "PUT",
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
}

export async function deleteProject(id: number): Promise<void> {
	return apiFetch<void>(`/judging/projects/${id}`, { method: "DELETE" });
}

export async function getProjectBreakdown(): Promise<ProjectBreakdownEntity[]> {
	return apiFetch<ProjectBreakdownEntity[]>("/judging/breakdown", {
		method: "GET",
	});
}

export async function assignJudging(
	data: JudgingAssignmentEntity
): Promise<void> {
	return apiFetch<void>("/judging/assign", {
		method: "POST",
		body: JSON.stringify(data),
	});
}
