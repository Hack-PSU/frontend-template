import ApiService from "./apiService";
import { Hackathon, User, Sponsor } from "../interfaces/Schema";

/**
 * Reads data from a database table based on the specified table name and optional ID.
 *
 * @param {string} table - The name of the table to read data from.
 * @param {args} - (Optional) An object containing optional arguments, which are listed below.
 * @param {string | number} args.id - (Optional) The ID of the record to read. If not specified, all records will be returned.
 * @param {boolean} args.noAuth - (Optional) If true, the API Service will not check that the user token is initialized.
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
			if (args?.id === undefined) {
				const hackathons: Hackathon[] = await ApiService.get<Hackathon[]>(
					`/hackathons`,
					useAuth
				);
				return hackathons;
			} else {
				const hackathon: Hackathon = await ApiService.get<Hackathon>(
					`/hackathons/${args.id}`,
					useAuth
				);
				return hackathon;
			}
			break;
		case "users":
			if (args?.id === undefined) {
				const users: User[] = await ApiService.get<User[]>(`/users`, useAuth);
				return users;
			} else {
				const user: User = await ApiService.get<User>(
					`/users/${args.id}`,
					useAuth
				);
				return user;
			}
			break;
		case "sponsors":
			if (args?.id === undefined) {
				const sponsors: Sponsor[] = await ApiService.get<Sponsor[]>(
					`/sponsors`,
					useAuth
				);
				return sponsors;
			} else {
				const sponsor: Sponsor = await ApiService.get<Sponsor>(
					`/sponsors/${args.id}`,
					useAuth
				);
				return sponsor;
			}
			break;

		default:
			throw new Error(
				`Table '${table}' is not implemented for read operations.`
			);
	}
}

/**
 * Writes data to a database table based on the specified table name.
 *
 * @param {string} table - The name of the table to write data to.
 * @param {any} data - The data to write to the table.
 * @returns The data that was written to the table.
 * @throws {Error} If table is invalid.
 */
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

/**
 * Deletes data from a database table based on the specified table name and ID.
 * @param {string} table - The name of the table to delete data from.
 * @param {string | number} id - The ID of the record to delete.
 * @throws {Error} If table is invalid.
 */
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

/**
 * Updates data in a database table based on the specified table name and data object.
 * @param {string} table - The name of the table to update data in.
 * @param {any} data - The data to update in the table.
 * @returns The data that was updated in the table.
 * @throws {Error} If table is invalid.
 * @throws {Error} If no ID is specified in the data object.
 */
export async function updateInDatabase(table: string, data: any) {
	if (!data.id) throw new Error("No ID specified in data object.");
	switch (table.toLowerCase()) {
		case "hackathons":
			const hackathon: Hackathon = await ApiService.patch<Hackathon>(
				`/hackathons/${data.id}`,
				data
			);
			return hackathon;
			break;
		case "users":
			const user: User = await ApiService.patch<User>(
				`/users/${data.id}`,
				data
			);
			return user;
			break;
		case "sponsors":
			const sponsor: Sponsor = await ApiService.patch<Sponsor>(
				`/sponsors/${data.id}`,
				data
			);
			return sponsor;
			break;

		default:
			throw new Error(
				`Table '${table}' is not implemented for update operations.`
			);
	}
}
