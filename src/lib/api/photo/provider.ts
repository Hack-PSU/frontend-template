import { apiFetch } from "../apiClient";

// Backend exposes routes under /photos (see apiv3 PhotoController)
export async function listPhotos() {
	return apiFetch("/photos", {
		method: "GET",
	});
}

export async function uploadPhoto(file: File, fileType = "default") {
	const fd = new FormData();
	fd.append("photo", file);
	fileType = file.type.split('/')[1] || 'default';
	fd.append("fileType", fileType);

	return apiFetch("/photos/upload", {
		method: "POST",
		body: fd,
	});
}

export async function deletePhoto(photoId: string) {
	return apiFetch(`/photos/${encodeURIComponent(photoId)}`, {
		method: "DELETE",
	});
}
