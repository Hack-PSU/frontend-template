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
  "Base 44 Challenge",
  "College of IST Challenge",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
