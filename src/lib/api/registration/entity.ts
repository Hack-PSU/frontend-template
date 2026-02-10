export interface RegistrationEntity {
	id: number;
	userId: string;
	age: number;
	shareAddressSponsors?: boolean;
	travelReimbursement?: boolean;
	shareAddressMlh?: boolean;
	educationalInstitutionType: string;
	academicYear: string;
	codingExperience: string;
	expectations: string;
	driving?: boolean;
	hackathonId: string;
	firstHackathon?: boolean;
	mlhCoc: boolean;
	mlhDcp: boolean;
	project: string;
	referral: string;
	shareEmailMlh?: boolean;
	time: number;
	veteran: string;
	excitement: string;
	zipCode?: string;
	travelCost?: number;
	travelMethod?: string;
	travelAdditional?: string;
	applicationStatus:
		| "pending"
		| "accepted"
		| "rejected"
		| "waitlisted"
		| "confirmed"
		| "declined";
	acceptedAt?: number;
	rsvpDeadline?: number;
	rsvpAt?: number;
	acceptedBy?: string;
}

export interface RegistrationCreateEntity extends Omit<
	RegistrationEntity,
	| "id"
	| "userId"
	| "hackathonId"
	| "time"
	| "applicationStatus"
	| "acceptedAt"
	| "rsvpDeadline"
	| "rsvpAt"
	| "acceptedBy"
> {}

export interface RegistrationUpdateEntity extends Partial<RegistrationCreateEntity> {}

export type ApplicationStatusRsvp = "confirmed" | "declined";
