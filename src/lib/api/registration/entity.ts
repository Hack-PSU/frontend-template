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
	zip_code?: string;
	travel_cost?: number;
	travel_method?: string;
	travel_additional?: string;
	applicationStatus: "pending" | "accepted" | "rejected" | "waitlisted" | "confirmed" | "declined";
	accepted_at?: number;
	rsvp_deadline?: number;
	rsvp_at?: number;
	accepted_by?: string;
}

export interface RegistrationCreateEntity
	extends Omit<RegistrationEntity, "id" | "userId" | "hackathonId" | "time" | "application_status" | "accepted_at" | "rsvp_deadline" | "rsvp_at" | "accepted_by"> {}

export interface RegistrationUpdateEntity extends Partial<RegistrationCreateEntity> {}
