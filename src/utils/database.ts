import ApiService from "./apiService";
import { Hackathon, User, Sponsor } from "../interfaces/Schema";

/**
 * Reads data from a database table based on the specified table name and optional ID.
 *
 * @param {string} table - The name of the table to read data from.
 * @param {args} id - (Optional) An object that specifies the ID of the record to read and whether to verify the user's authentication.
 * @returns An array of records if no ID is specified, or a single record if an ID is specified. Undefined if no record is found with the specified ID.
 * @throws {Error} If table is invalid.
 */
export async function readFromDatabase(
	table: string,
	args?: { id?: string | number; noAuth?: boolean }
) {
	const useAuth: boolean = !args?.noAuth;
	switch (table.toLowerCase()) {
		case "hackathons":
			const hackathons: Hackathon[] = await ApiService.get<Hackathon[]>(
				`/hackathons`,
				useAuth
			);
			if (args?.id) {
				return hackathons.find(
					(hackathon: Hackathon) => hackathon.id === args.id
				);
			} else {
				return hackathons;
			}
			break;
		case "users":
			const users: User[] = await ApiService.get<User[]>(`/users`, useAuth);
			if (args?.id) {
				return users.find((user: User) => user.id === args.id);
			} else {
				return users;
			}
			break;
		case "sponsors":
			const sponsors: Sponsor[] = await ApiService.get<Sponsor[]>(
				`/sponsors`,
				useAuth
			);
			if (args?.id) {
				return sponsors.find((sponsor: Sponsor) => sponsor.id === args.id);
			} else {
				return sponsors;
			}
			break;

		default:
			throw new Error(
				`Table '${table}' is not implemented for read operations.`
			);
	}
}

export async function writeToDatabase(table: string, data: any) {
	switch (table.toLowerCase()) {
		case "hackathons":
			const hackathon: Hackathon = await ApiService.post<Hackathon>(
				`/hackathons`,
				data
			);
			return hackathon;
			break;
		case "users":
			const user: User = await ApiService.post<User>(`/users`, data);
			return user;
			break;
		case "sponsors":
			const sponsor: Sponsor = await ApiService.post<Sponsor>(
				`/sponsors`,
				data
			);
			return sponsor;
			break;

		default:
			throw new Error(
				`Table '${table}' is not implemented for write operations.`
			);
	}
}

export async function deleteFromDatabase(table: string, id: string | number) {
	switch (table.toLowerCase()) {
		case "hackathons":
			await ApiService.delete<Hackathon>(`/hackathons/${id}`);
			break;
		case "users":
			await ApiService.delete<User>(`/users/${id}`);
			break;
		case "sponsors":
			await ApiService.delete<Sponsor>(`/sponsors/${id}`);
			break;

		default:
			throw new Error(
				`Table '${table}' is not implemented for delete operations.`
			);
	}
}
