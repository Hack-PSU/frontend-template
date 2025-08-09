import { UserEntity } from "../user/entity";

export enum TeamRole {
	LEAD = "lead",
	MEMBER = "member",
}

export interface TeamRosterEntity {
	id: string;
	hackathonId: string;
	teamId: string;
	teamName: string;
	userId: string;
	role: TeamRole;
	joinedAt: number;
	updatedAt: number;
}

export interface TeamRosterWithUser extends TeamRosterEntity {
	user?: UserEntity;
}

export interface TeamsOverviewItem {
	teamId: string;
	teamName: string;
	members: number;
}

export interface CreateTeamRequest {
	teamName: string;
}

export interface AddMemberRequest {
	teamId: string;
	userEmail: string;
}

export interface ChangeLeadRequest {
	teamId: string;
	newLeadUserId: string;
}

export interface TransferUserRequest {
	userId: string;
	newTeamId: string;
	newTeamName: string;
}

export interface RenameTeamRequest {
	teamId: string;
	newTeamName: string;
}
