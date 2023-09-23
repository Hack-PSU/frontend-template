export interface Hackathon {
	id: string;
	name: string;
	startTime: number;
	endTime: number;
	active?: boolean;
	checkInId?: string;
}
