import { apiFetch } from "@/lib/api/apiClient";
import { WalletLinkResponse } from "./entity";

export async function createWalletPass(
	userId: string
): Promise<WalletLinkResponse> {
	return apiFetch<WalletLinkResponse>(`/wallet/${userId}/pass`, {
		method: "POST",
	});
}

export async function createAppleWalletPass(userId: string): Promise<Blob> {
	const response = await apiFetch<Blob>(`/wallet/apple/${userId}/pass`, {
		method: "POST",
		responseType: "blob",
	});

	return response;
}
