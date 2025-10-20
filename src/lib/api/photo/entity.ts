export interface PhotoEntity {
	name: string;
	url: string;
	createdAt: string;
}

export interface PhotoUploadResponse {
	photoId: string;
	photoUrl: string;
}

export interface PendingPhoto {
	photoId: string;
	photoUrl: string;
	fileType: string;
	uploadedAt: string;
}

export interface PhotoMilestone {
	id: string;
	label: string;
	description: string;
	category: "event" | "food" | "coding" | "social" | "general";
}

// Photo milestones for the HackPSU journey
export const PHOTO_MILESTONES: PhotoMilestone[] = [
	{
		id: "public",
		label: "Public Gallery",
		description: "Share with the entire HackPSU community",
		category: "general",
	},
	{
		id: "check-in",
		label: "Check-In",
		description: "Arrival at HackPSU",
		category: "event",
	},
	{
		id: "team-formation",
		label: "Team Formation",
		description: "Meeting your team",
		category: "social",
	},
	{
		id: "opening-ceremony",
		label: "Opening Ceremony",
		description: "Event kickoff",
		category: "event",
	},
	{
		id: "hacking",
		label: "Hacking Session",
		description: "Building your project",
		category: "coding",
	},
	{
		id: "lunch",
		label: "Lunch",
		description: "Midday meal",
		category: "food",
	},
	{
		id: "dinner",
		label: "Dinner",
		description: "Evening meal",
		category: "food",
	},
	{
		id: "midnight-snack",
		label: "Midnight Snack",
		description: "Late night fuel",
		category: "food",
	},
	{
		id: "workshop",
		label: "Workshop",
		description: "Learning session",
		category: "event",
	},
	{
		id: "mentoring",
		label: "Mentoring",
		description: "Getting help from mentors",
		category: "social",
	},
	{
		id: "networking",
		label: "Networking",
		description: "Meeting sponsors and peers",
		category: "social",
	},
	{
		id: "demo",
		label: "Project Demo",
		description: "Presenting your work",
		category: "event",
	},
	{
		id: "closing-ceremony",
		label: "Closing Ceremony",
		description: "Awards and wrap-up",
		category: "event",
	},
	{
		id: "other",
		label: "Other Moment",
		description: "Any other memorable moment",
		category: "general",
	},
];
