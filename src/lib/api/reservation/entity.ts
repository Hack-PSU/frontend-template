export enum ReservationType {
	PARTICIPANT = "participant",
	ADMIN = "admin",
}

export interface ReservationEntity {
	id: string;
	locationId: number;
	teamId: string | null;
	reservationType: ReservationType;
	startTime: number;
	endTime: number;
	hackathonId: string;
}

export interface CreateReservationEntity {
	locationId: number;
	teamId: string;
	startTime: number;
	endTime: number;
	hackathonId: string;
}

export interface LocationEntity {
	id: number;
	name: string;
	capacity: number;
}
