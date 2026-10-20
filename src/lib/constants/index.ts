/**
 * Values this app defines for itself. They are not part of the API, so they do
 * not come from @hackpsu/react-sdk and are kept here rather than alongside the
 * generated client.
 */

/** The single expense category a non-organizer may submit against. */
export enum UsersCategory {
	TravelTransportation = "Travel - Transportation",
}

/** Prize tracks shown on the project submission form. */
export const PROJECT_CATEGORIES = [
	"Research Track",
	"The Mystery Stack",
	"AI Strategy Case Challenge",
	"Nittany AI Challenge",
	"First National Bank Challenge",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/**
 * Judged separately from the rest of the hackathon, so a project entered in
 * this track cannot be entered in any other.
 */
export const EXCLUSIVE_PROJECT_CATEGORY: ProjectCategory =
	"AI Strategy Case Challenge";
