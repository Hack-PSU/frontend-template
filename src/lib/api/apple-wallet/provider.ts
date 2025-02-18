import { apiFetch } from "@/lib/api/apiClient";
import { WalletLinkResponse } from "./entity";

export async function createAppleWalletPass(
    userId: string
): Promise<WalletLinkResponse> {
    return apiFetch<WalletLinkResponse>(`/applewallet/${userId}/pass`, {
        method: "POST",
    });
}
