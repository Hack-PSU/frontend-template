import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPhotos, uploadPhoto } from "./provider";
import type { PhotoEntity, PhotoUploadResponse } from "./entity";

/**
 * Hook to fetch all approved photos from the gallery
 */
export function usePhotos() {
	return useQuery<PhotoEntity[]>({
		queryKey: ["photos"],
		queryFn: () => listPhotos(),
		staleTime: 1000 * 30, // 30 seconds
		refetchOnWindowFocus: true,
	});
}

/**
 * Hook to upload a photo with a milestone/reason
 */
export function useUploadPhoto() {
	const qc = useQueryClient();
	return useMutation<
		PhotoUploadResponse,
		Error,
		{ file: File; fileType: string }
	>({
		mutationFn: ({ file, fileType }) => uploadPhoto(file, fileType),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["photos"] });
		},
	});
}
