import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getAllScores,
	getScore,
	createScore,
	updateScore,
	deleteScore,
	getAllProjects,
	getProject,
	getProjectsByTeamId,
	createProject,
	patchProject,
	replaceProject,
	deleteProject,
	getProjectBreakdown,
	assignJudging,
} from "./provider";
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

export const judgingQueryKeys = {
	allScores: ["judging", "scores"] as const,
	scoreDetail: (id: number) => ["judging", "score", id] as const,
	allProjects: ["judging", "projects"] as const,
	projectDetail: (id: number) => ["judging", "project", id] as const,
	projectsByTeam: (teamId: string) =>
		["judging", "projects", "team", teamId] as const,
	projectBreakdown: ["judging", "breakdown"] as const,
};

export function useAllScores() {
	return useQuery<ScoreEntity[]>({
		queryKey: judgingQueryKeys.allScores,
		queryFn: getAllScores,
	});
}

export function useScore(id: number) {
	return useQuery<ScoreEntity>({
		queryKey: judgingQueryKeys.scoreDetail(id),
		queryFn: () => getScore(id),
		enabled: Boolean(id),
	});
}

export function useCreateScore() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ScoreCreateEntity) => createScore(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: judgingQueryKeys.allScores });
		},
	});
}

export function useUpdateScore() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: ScoreUpdateEntity }) =>
			updateScore(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: judgingQueryKeys.allScores });
		},
	});
}

export function useDeleteScore() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => deleteScore(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: judgingQueryKeys.allScores });
		},
	});
}

export function useAllProjects() {
	return useQuery<ProjectEntity[]>({
		queryKey: judgingQueryKeys.allProjects,
		queryFn: getAllProjects,
	});
}

export function useProject(id: number) {
	return useQuery<ProjectEntity>({
		queryKey: judgingQueryKeys.projectDetail(id),
		queryFn: () => getProject(id),
		enabled: Boolean(id),
	});
}

export function useProjectsByTeamId(teamId: string) {
	return useQuery<ProjectEntity[]>({
		queryKey: judgingQueryKeys.projectsByTeam(teamId),
		queryFn: () => getProjectsByTeamId(teamId),
		enabled: Boolean(teamId),
	});
}

export function useCreateProject() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: ProjectCreateEntity) => createProject(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: judgingQueryKeys.allProjects });
		},
	});
}

export function usePatchProject() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: ProjectPatchEntity }) =>
			patchProject(id, data),
		onSuccess: (updated) => {
			queryClient.invalidateQueries({ queryKey: judgingQueryKeys.allProjects });
			queryClient.invalidateQueries({
				queryKey: judgingQueryKeys.projectDetail(updated.id),
			});
		},
	});
}

export function useReplaceProject() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: ProjectCreateEntity }) =>
			replaceProject(id, data),
		onSuccess: (updated) => {
			queryClient.invalidateQueries({ queryKey: judgingQueryKeys.allProjects });
			queryClient.invalidateQueries({
				queryKey: judgingQueryKeys.projectDetail(updated.id),
			});
		},
	});
}

export function useDeleteProject() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => deleteProject(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: judgingQueryKeys.allProjects });
		},
	});
}

export function useProjectBreakdown() {
	return useQuery<ProjectBreakdownEntity[]>({
		queryKey: judgingQueryKeys.projectBreakdown,
		queryFn: getProjectBreakdown,
	});
}

export function useAssignJudging() {
	return useMutation({
		mutationFn: (data: JudgingAssignmentEntity) => assignJudging(data),
	});
}
