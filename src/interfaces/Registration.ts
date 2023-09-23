export interface Registration {
	id?: number;
	userId?: string;
	travelReimbursement: boolean;
	driving: boolean;
	firstHackathon: boolean;
	academicYear: string;
	educationalInstitutionType: string;
	codingExperience: string;
	eighteenBeforeEvent: boolean;
	mlhCoc: boolean;
	mlhDcp: boolean;
	referral: string;
	project: string;
	expectations: string;
	shareAddressMlh: boolean;
	shareAddressSponsors: boolean;
	shareEmailMlh: boolean;
	veteran: string;
	hackathonId?: string;
	time: number;
}
