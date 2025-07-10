// src/common/api/user/hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getAllUsers,
	getUser,
	createUser,
	updateUser,
	replaceUser,
	deleteUser,
	getUserResume,
	getUserInfoMe,
} from "./provider";
import { UserCreateEntity, UserEntity, UserInfoMe } from "./entity";

export const userQueryKeys = {
	all: ["users"] as const,
	detail: (id: string) => ["user", id] as const,
	resume: (id: string) => ["user", id, "resume"] as const,
	me: ["user", "info", "me"] as const,
};

export function useAllUsers(active?: boolean) {
	return useQuery<UserEntity[]>({
		queryKey: userQueryKeys.all,
		queryFn: () => getAllUsers(active),
	});
}

export function useUser(id: string) {
	return useQuery<UserEntity>({
		queryKey: userQueryKeys.detail(id),
		queryFn: () => getUser(id),
		enabled: Boolean(id),
	});
}

export function useCreateUser() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (newData: Omit<UserEntity, "id"> & { resume?: File }) =>
			createUser(newData),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: userQueryKeys.all });
		},
	});
}

export function useUpdateUser() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (opts: {
			id: string;
			data: Partial<Omit<UserEntity, "id">> & { resume?: File | null };
		}) => updateUser(opts.id, opts.data),
		onSuccess: (updated) => {
			qc.invalidateQueries({ queryKey: userQueryKeys.all });
			qc.invalidateQueries({
				queryKey: userQueryKeys.detail(updated.id),
			});
		},
	});
}

export function useReplaceUser() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (opts: {
			id: string;
			data: Omit<UserEntity, "id" | "resume"> & {
				resume?: File | null | undefined;
			};
		}) => replaceUser(opts.id, opts.data),
		onSuccess: (updated) => {
			qc.invalidateQueries({ queryKey: userQueryKeys.all });
			qc.invalidateQueries({
				queryKey: userQueryKeys.detail(updated.id),
			});
		},
	});
}

export function useDeleteUser() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => deleteUser(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: userQueryKeys.all });
		},
	});
}

export function useUserResume(id: string) {
	return useQuery<Blob>({
		queryKey: userQueryKeys.resume(id),
		queryFn: () => getUserResume(id),
		enabled: Boolean(id),
	});
}

export function useUserInfoMe() {
	return useQuery<UserInfoMe>({
		queryKey: userQueryKeys.me,
		queryFn: getUserInfoMe,
		retry: 2,
		retryDelay: 1000,
	});
}
