import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPhotos, uploadPhoto, deletePhoto } from "./provider";

export function usePhotos() {
	return useQuery({
		queryKey: ["photos"],
		queryFn: () => listPhotos(),
		staleTime: 1000 * 60, // 1 minute
	});
}

export function useUploadPhoto() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ file, fileType }: { file: File; fileType?: string }) =>
			uploadPhoto(file, fileType),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["photos"] }),
	});
}

export function useDeletePhoto() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (photoId: string) => deletePhoto(photoId),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["photos"] }),
	});
}
