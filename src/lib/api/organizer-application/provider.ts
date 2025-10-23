import { apiFetch } from "@/lib/api/apiClient";
import {
	OrganizerApplicationEntity,
	OrganizerApplicationCreateEntity,
} from "./entity";

function isFile(x: any): x is File {
	return typeof File !== "undefined" && x instanceof File;
}

function makeFormData(data: Record<string, any>) {
	const fd = new FormData();
	for (const [k, v] of Object.entries(data)) {
		if (v == null) continue;
		if (isFile(v)) {
			fd.append(k, v);
		} else {
			fd.append(k, String(v));
		}
	}
	return fd;
}

export async function submitOrganizerApplication(
	data: OrganizerApplicationCreateEntity
): Promise<OrganizerApplicationEntity> {
	const body = makeFormData(data);

	return apiFetch<OrganizerApplicationEntity>("/organizer-applications", {
		method: "POST",
		body,
		noAuth: true,
	});
}
