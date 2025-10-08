// Backend exposes routes under /photos (see apiv3 PhotoController)
const BASE = process.env.NEXT_PUBLIC_PHOTO_API_BASE || "/photos";

export async function listPhotos() {
	const res = await fetch(`${BASE}`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Failed to list photos: ${res.status} ${text}`);
	}

	return res.json();
}

export async function uploadPhoto(file: File, fileType = "default") {
	const fd = new FormData();
	fd.append("photo", file);
	fd.append("fileType", fileType);

	const res = await fetch(`${BASE}/upload`, {
		method: "POST",
		body: fd,
		credentials: "include",
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Upload failed: ${res.status} ${text}`);
	}

	return res.json();
}

export async function deletePhoto(photoId: string) {
	const res = await fetch(`${BASE}/${encodeURIComponent(photoId)}`, {
		method: "DELETE",
		credentials: "include",
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Delete failed: ${res.status} ${text}`);
	}

	return res.json();
}
