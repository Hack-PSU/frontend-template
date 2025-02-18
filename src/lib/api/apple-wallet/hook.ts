import { useMutation } from "@tanstack/react-query";
import { createAppleWalletPass } from "./provider";
import { WalletLinkResponse } from "./entity";

export function useCreateAppleWalletPass() {
	return useMutation<WalletLinkResponse, Error, string>({
		mutationFn: (userId: string) => createAppleWalletPass(userId),
	});
}
