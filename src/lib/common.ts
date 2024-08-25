import { UserProfile } from "@/interfaces";
import ApiService from "@/lib/api/apiService";

export async function getActiveUser(): Promise<UserProfile | undefined> {
	try {
		const user: UserProfile | undefined =
			await ApiService.get<UserProfile>(`/users/info/me`);
		return user;
	} catch {
		return undefined;
	}
}

export { getActiveUser as who }; // Alias

export async function getActiveHackathon(): Promise<any> {
	const hackathon: any = await ApiService.get<any>(
		`/hackathons/active/static`,
		false
	);
	return hackathon;
}
