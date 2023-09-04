export interface Hackathon {
	id: string;
	name: string;
	startTime: number;
	endTime: number;
	active?: boolean;
	checkInId?: string;
}

export interface Location {
	id: number;
	name: string;
}

export interface Event {
	id: string;
	name: string;
	type: string;
	description: string;
	locationId: number;
	icon: string;
	startTime: number;
	endTime: number;
	wsPresenterNames: string;
	wsRelevantSkills: string;
	wsSkillLevel: string;
	hackathonId: string;
	wsUrls: string[];
	location: Location;
}

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	gender: string;
	shirtSize: string;
	dietaryRestriction: string;
	allergies: string;
	university: string;
	email: string;
	major: string;
	phone: string;
	country: string;
	race: string;
	resume: string;
}

export interface HackathonUser extends User {
	travelReimbursement: boolean;
	driving: boolean;
	firstHackathon: boolean;
	academicYear: string;
	educationalInsitutionType: string;
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
	time: number;
}

export interface Organizer {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	privilege: number;
}

export interface Score {
	creativity: number;
	technical: number;
	implementation: number;
	clarity: number;
	growth: number;
	energy: number;
	supplyChain: number;
	environmental: number;
	submitted: boolean;
}

export interface Project {
	id: number;
	name: string;
	score?: Score;
}

export interface ProjectScoreBreakdown extends Project {
	hackathonId: string;
	average: number;
	meanScore: Score;
	scores: Score[];
}

export interface Sponsor {
	id: number;
	name: string;
	level: string;
	link: string;
	darkLogo: string;
	lightLogo: string;
	order: number;
	hackathonId: string;
}

export interface Scan {
	eventId: string;
	userId: string;
	hackathonId: string;
}

export interface ExtraCredit {
	id: number;
	name: string;
	hackathonId: string;
}
