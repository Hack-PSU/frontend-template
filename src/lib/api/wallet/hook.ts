import { useMutation } from "@tanstack/react-query";
import { createAppleWalletPass, createWalletPass } from "./provider";
import { WalletLinkResponse } from "./entity";

export function useCreateWalletPass() {
	return useMutation<WalletLinkResponse, Error, string>({
		mutationFn: (userId: string) => createWalletPass(userId),
	});
}

export function useCreateAppleWalletPass() {
	return useMutation<Blob, Error, string>({
		mutationFn: (userId: string) => createAppleWalletPass(userId),
	});
}
