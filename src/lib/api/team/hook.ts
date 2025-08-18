import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getAllTeams,
	getTeam,
	createTeam,
	updateTeam,
	addUserToTeamByEmail,
} from "./provider";
import {
	TeamEntity,
	TeamCreateEntity,
	TeamUpdateEntity,
	AddUserByEmailEntity,
} from "./entity";

export const teamQueryKeys = {
	all: ["teams"] as const,
	detail: (id: string) => ["team", id] as const,
};

export function useAllTeams() {
	return useQuery<TeamEntity[]>({
		queryKey: teamQueryKeys.all,
		queryFn: getAllTeams,
	});
}

export function useTeam(id: string) {
	return useQuery<TeamEntity>({
		queryKey: teamQueryKeys.detail(id),
		queryFn: () => getTeam(id),
		enabled: Boolean(id),
	});
}

export function useCreateTeam() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: TeamCreateEntity) => createTeam(data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: teamQueryKeys.all });
		},
	});
}

export function useUpdateTeam() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (opts: { id: string; data: TeamUpdateEntity }) =>
			updateTeam(opts.id, opts.data),
		onSuccess: (updated) => {
			qc.invalidateQueries({ queryKey: teamQueryKeys.all });
			qc.invalidateQueries({
				queryKey: teamQueryKeys.detail(updated.id),
			});
		},
	});
}

export function useAddUserToTeamByEmail() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (opts: { id: string; data: AddUserByEmailEntity }) =>
			addUserToTeamByEmail(opts.id, opts.data),
		onSuccess: (updated) => {
			qc.invalidateQueries({ queryKey: teamQueryKeys.all });
			qc.invalidateQueries({
				queryKey: teamQueryKeys.detail(updated.id),
			});
		},
	});
}
