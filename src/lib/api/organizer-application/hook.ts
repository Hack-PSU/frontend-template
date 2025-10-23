import { useMutation } from "@tanstack/react-query";
import { submitOrganizerApplication } from "./provider";
import { OrganizerApplicationCreateEntity } from "./entity";

export function useSubmitOrganizerApplication() {
	return useMutation({
		mutationFn: (data: OrganizerApplicationCreateEntity) =>
			submitOrganizerApplication(data),
	});
}
