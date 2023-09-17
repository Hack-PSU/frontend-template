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
