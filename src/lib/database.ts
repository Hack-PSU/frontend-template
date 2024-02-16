import ApiService from "./api/apiService";
import {
	Hackathon,
	User,
	Sponsor,
	EventModel,
	Registration,
} from "@/interfaces";

/**
 * Reads data from a database table based on the specified table name and optional ID.
 *
 * @param {string} table - The name of the table to read data from.
 * @param {args} - (Optional) An object containing optional arguments, which are listed below.
 * @param {string | number} args.id - (Optional) The ID of the record to read. If not specified, all records will be returned.
 * @param {boolean} args.noAuth - (Optional) If true, the API Service will not check that the user token is initialized.
 * @returns An array of records if no ID is specified, or a single record if an ID is specified. Undefined if no record is found with the specified ID.
 * @throws {Error} If table is invalid.
 *
 * Notice: For type inference to properly work, you must call this function like so, using the "as <type>" syntax:
 * @example const res: User = await readFromDatabase<User>("users", { id: USER_ID });
 */
export async function readFromDatabase<T>(
	table: string,
	args?: { id?: string | number; noAuth?: boolean }
): Promise<T> {
	const useAuth: boolean = !args?.noAuth;
	switch (table.toLowerCase()) {
		case "events":
			if (args?.id === undefined) {
				const events: EventModel[] | undefined = await ApiService.get<
					EventModel[]
				>(`/events`, useAuth);
				return events as unknown as T;
			} else {
				const event: EventModel | undefined = await ApiService.get<EventModel>(
					`/events/${args.id}`,
					useAuth
				);
				return event as unknown as T;
			}
			break;
		case "hackathons":
			if (args?.id === undefined) {
				const hackathons: Hackathon[] | undefined = await ApiService.get<
					Hackathon[]
				>(`/hackathons`, useAuth);
				return hackathons as unknown as T;
			} else {
				const hackathon: Hackathon | undefined =
					await ApiService.get<Hackathon>(`/hackathons/${args.id}`, useAuth);
				return hackathon as unknown as T;
			}
			break;
		case "registrations":
			if (args?.id === undefined) {
				const registrations: Registration[] | undefined = await ApiService.get<
					Registration[]
				>(`/registrations`, useAuth);
				return registrations as unknown as T;
			} else {
				const registration: Registration | undefined =
					await ApiService.get<Registration>(
						`/registrations/${args.id}`,
						useAuth
					);
				return registration as unknown as T;
			}
			break;
		case "sponsors":
			if (args?.id === undefined) {
				const sponsors: Sponsor[] | undefined = await ApiService.get<Sponsor[]>(
					`/sponsors`,
					useAuth
				);
				return sponsors as unknown as T;
			} else {
				const sponsor: Sponsor | undefined = await ApiService.get<Sponsor>(
					`/sponsors/${args.id}`,
					useAuth
				);
				return sponsor as unknown as T;
			}
			break;
		case "users":
			if (args?.id === undefined) {
				const users: User[] | undefined = await ApiService.get<User[]>(
					`/users`,
					useAuth
				);
				return users as unknown as T;
			} else {
				const user: User | undefined = await ApiService.get<User>(
					`/users/${args.id}`,
					useAuth
				);
				return user as unknown as T;
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
export async function writeToDatabase<T>(table: string, data: any): Promise<T> {
	switch (table.toLowerCase()) {
		case "events":
			const event: EventModel | undefined = await ApiService.post<EventModel>(
				`/event`,
				data
			);
			return event as unknown as T;
			break;
		case "users":
			const user: User | undefined = await ApiService.put<User>(`/users`, data);
			return user as unknown as T;
			break;
		case "registrations":
			if (data.userId === undefined) {
				throw new Error("User ID was not specified in registration.");
			}
			const { userId, ...registrationData } = data;
			const registration: Registration | undefined =
				await ApiService.post<Registration>(
					`/users/${userId}/register`,
					registrationData
				);
			return registration as unknown as T;
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
 * @throws {Error} If table is invalid or called without ID parameter.
 */
export async function deleteFromDatabase(
	table: string,
	id: string | number
): Promise<void> {
	if (!id) throw new Error("No ID specified in data object.");
	switch (table.toLowerCase()) {
		case "events":
			await ApiService.delete<EventModel>(`/events/${id}`);
			break;
		case "users":
			await ApiService.delete<User>(`/users/${id}`);
			break;
		case "registration":
			await ApiService.delete<Registration>(`/registration/${id}`);
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
export async function updateInDatabase<T>(
	table: string,
	data: any
): Promise<T> {
	if (!data.id) throw new Error("No ID specified in data object.");
	switch (table.toLowerCase()) {
		case "events":
			const event: EventModel | undefined = await ApiService.patch<EventModel>(
				`/events/${data.id}`,
				data
			);
			return event as unknown as T;
			break;
		case "users":
			const user: User | undefined = await ApiService.patch<User>(
				`/users/${data.id}`,
				data
			);
			return user as unknown as T;
			break;
		case "registrations":
			const registration: Registration | undefined =
				await ApiService.patch<Registration>(`/registrations/${data.id}`, data);
			return registration as unknown as T;
			break;

		default:
			throw new Error(
				`Table '${table}' is not implemented for update operations.`
			);
	}
}
