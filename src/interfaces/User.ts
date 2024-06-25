export interface User {
	id: string;
	firstName: string;
	lastName: string;
	gender: string;
	shirtSize: string;
	dietaryRestriction?: string;
	allergies?: string;
	university: string;
	email: string;
	major: string;
	phone: string;
	country: string;
	race?: string;
	resume?: string;
}

import { Registration } from "./Registration";
export interface UserProfile extends User {
	registration: Registration;
}
