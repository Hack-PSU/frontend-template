export type RoomType = "hacking" | "public" | "workshop" | "offlimits";

export interface Room {
	id: string;
	name: string;
	roomNumber?: string;
	// Tooltip info is now optional.
	description?: string;
	path: string; // SVG path data
	type: RoomType;
	color: string;
	position: [number, number]; // For labels
}

export interface Floor {
	id: string;
	name: string;
	rooms: Room[];
}
