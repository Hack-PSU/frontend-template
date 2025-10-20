import { apiFetch } from "../apiClient";
import type { PhotoEntity, PhotoUploadResponse } from "./entity";

/**
 * Get all approved photos from the gallery
 * Only returns photos with approvalStatus === "approved"
 */
export async function listPhotos(): Promise<PhotoEntity[]> {
	return apiFetch<PhotoEntity[]>("/photos", {
		method: "GET",
	});
}

/**
 * Upload a photo or video to the gallery
 * @param file - The image or video file to upload
 * @param fileType - The milestone/reason for the photo (e.g., "check-in", "lunch", "midnight-snack")
 * @returns Upload response with photoId and photoUrl
 */
export async function uploadPhoto(
	file: File,
	fileType: string = "other"
): Promise<PhotoUploadResponse> {
	const fd = new FormData();
	fd.append("photo", file);
	fd.append("fileType", fileType);

	return apiFetch<PhotoUploadResponse>("/photos/upload", {
		method: "POST",
		body: fd,
	});
}
