import { UserProfile } from "@/interfaces";
import ApiService from "@/lib/api/apiService";

export async function getActiveUser(): Promise<UserProfile | undefined> {
	const user: UserProfile | undefined = await ApiService.get<UserProfile>(
		`/users/info/me`
	);
	return user;
}

export { getActiveUser as who }; // Alias

export async function getActiveHackathon(): Promise<any> {
	const hackathon: any = await ApiService.get<any>(
		`/hackathons/active/static`,
		false
	);
	return hackathon;
}
