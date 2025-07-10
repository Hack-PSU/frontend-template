// src/common/api/registration/hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getAllRegistrations,
	getRegistration,
	createRegistration,
	updateRegistration,
	replaceRegistration,
	deleteRegistration,
} from "./provider";
import {
	RegistrationEntity,
	RegistrationCreateEntity,
	RegistrationUpdateEntity,
} from "./entity";

export const registrationQueryKeys = {
	all: ["registrations"] as const,
	detail: (id: string) => ["registration", id] as const,
};

export function useAllRegistrations(all?: boolean) {
	return useQuery<RegistrationEntity[]>({
		queryKey: registrationQueryKeys.all,
		queryFn: () => getAllRegistrations(all),
	});
}

export function useRegistration(id: string) {
	return useQuery<RegistrationEntity>({
		queryKey: registrationQueryKeys.detail(id),
		queryFn: () => getRegistration(id),
		enabled: Boolean(id),
	});
}

export function useCreateRegistration() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (opts: { userId: string; data: RegistrationCreateEntity }) =>
			createRegistration(opts.userId, opts.data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: registrationQueryKeys.all });
		},
	});
}

export function useUpdateRegistration() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (opts: { id: string; data: RegistrationUpdateEntity }) =>
			updateRegistration(opts.id, opts.data),
		onSuccess: (updated) => {
			queryClient.invalidateQueries({ queryKey: registrationQueryKeys.all });
			queryClient.invalidateQueries({
				queryKey: registrationQueryKeys.detail(updated.id.toString()),
			});
		},
	});
}

export function useReplaceRegistration() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (opts: { id: string; data: RegistrationCreateEntity }) =>
			replaceRegistration(opts.id, opts.data),
		onSuccess: (updated) => {
			queryClient.invalidateQueries({ queryKey: registrationQueryKeys.all });
			queryClient.invalidateQueries({
				queryKey: registrationQueryKeys.detail(updated.id.toString()),
			});
		},
	});
}

export function useDeleteRegistration() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteRegistration(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: registrationQueryKeys.all });
		},
	});
}
