import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	createTeam,
	addMember,
	changeLead,
	removeMember,
	transferUser,
	renameTeam,
	deleteTeam,
	getUserTeam,
	getMyTeam,
	getTeamRoster,
	getTeamsOverview,
} from "./provider";
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

export const teamsQueryKeys = {
	all: ["teams"] as const,
	overview: ["teams", "overview"] as const,
	user: (userId: string) => ["teams", "user", userId] as const,
	me: ["teams", "user", "me"] as const,
	roster: (teamId: string) => ["teams", "roster", teamId] as const,
};

export function useCreateTeam() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: CreateTeamRequest) => createTeam(data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: teamsQueryKeys.me });
			qc.invalidateQueries({ queryKey: teamsQueryKeys.overview });
		},
	});
}

export function useAddMember() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: AddMemberRequest) => addMember(data),
		onSuccess: (_, variables) => {
			qc.invalidateQueries({
				queryKey: teamsQueryKeys.roster(variables.teamId),
			});
			qc.invalidateQueries({ queryKey: teamsQueryKeys.overview });
		},
	});
}

export function useChangeLead() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: ChangeLeadRequest) => changeLead(data),
		onSuccess: (_, variables) => {
			qc.invalidateQueries({
				queryKey: teamsQueryKeys.roster(variables.teamId),
			});
			qc.invalidateQueries({ queryKey: teamsQueryKeys.me });
		},
	});
}

export function useRemoveMember() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (userId: string) => removeMember(userId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: teamsQueryKeys.all });
			qc.invalidateQueries({ queryKey: teamsQueryKeys.me });
			qc.invalidateQueries({ queryKey: teamsQueryKeys.overview });
		},
	});
}

export function useTransferUser() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: TransferUserRequest) => transferUser(data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: teamsQueryKeys.all });
			qc.invalidateQueries({ queryKey: teamsQueryKeys.overview });
		},
	});
}

export function useRenameTeam() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: RenameTeamRequest) => renameTeam(data),
		onSuccess: (_, variables) => {
			qc.invalidateQueries({
				queryKey: teamsQueryKeys.roster(variables.teamId),
			});
			qc.invalidateQueries({ queryKey: teamsQueryKeys.me });
			qc.invalidateQueries({ queryKey: teamsQueryKeys.overview });
		},
	});
}

export function useDeleteTeam() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (teamId: string) => deleteTeam(teamId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: teamsQueryKeys.all });
			qc.invalidateQueries({ queryKey: teamsQueryKeys.overview });
		},
	});
}

export function useUserTeam(userId: string) {
	return useQuery<TeamRosterWithUser | null>({
		queryKey: teamsQueryKeys.user(userId),
		queryFn: () => getUserTeam(userId),
		enabled: Boolean(userId),
	});
}

export function useMyTeam() {
	return useQuery<TeamRosterWithUser | null>({
		queryKey: teamsQueryKeys.me,
		queryFn: getMyTeam,
		retry: 2,
		retryDelay: 1000,
	});
}

export function useTeamRoster(teamId: string) {
	return useQuery<TeamRosterWithUser[]>({
		queryKey: teamsQueryKeys.roster(teamId),
		queryFn: () => getTeamRoster(teamId),
		enabled: Boolean(teamId),
	});
}

export function useTeamsOverview() {
	return useQuery<TeamsOverviewItem[]>({
		queryKey: teamsQueryKeys.overview,
		queryFn: getTeamsOverview,
	});
}
