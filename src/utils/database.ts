import ApiService from "./apiService";
import { Hackathon, User } from "../interfaces/Schema";

/**
 * Reads data from a database table based on the specified table name and optional ID.
 *
 * @param {string} table - The name of the table to read data from.
 * @param {string | number | undefined} id - (Optional) The ID of the specific record to retrieve.
 * @returns An array of records if no ID is specified, or a single record if an ID is specified. Undefined if no record is found with the specified ID.
 * @throws {Error} If table is invalid.
 */
export async function readFromDatabase(table: string, id?: string | number) {
	switch (table.toLowerCase()) {
		case "hackathons":
			const hackathons: Hackathon[] = await ApiService.get<Hackathon[]>(
				`/hackathons`
			);
			if (id) {
				return hackathons.find((hackathon: Hackathon) => hackathon.id === id);
			} else {
				return hackathons;
			}
			break;
		case "users":
			const users: User[] = await ApiService.get<User[]>(`/users`);
			if (id) {
				return users.find((user: User) => user.id === id);
			} else {
				return users;
			}
			break;

		default:
			throw new Error(`Table '${table}' does not exist in the database.`);
	}
}
