import { RegistrationEntity } from "../registration/entity";

export interface UserEntity {
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

export interface UserCreateEntity extends Omit<UserEntity, "id" | "resume"> {
	resume?: File;
}

export interface UserInfoMe extends UserEntity {
	registration: RegistrationEntity;
}
