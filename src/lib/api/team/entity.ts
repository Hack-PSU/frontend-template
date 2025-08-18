export interface TeamEntity {
	id: string;
	name: string;
	member1?: string;
	member2?: string;
	member3?: string;
	member4?: string;
	member5?: string;
	isActive: boolean;
}

export interface TeamCreateEntity extends Omit<TeamEntity, "id" | "isActive"> {}

export interface TeamUpdateEntity extends Partial<TeamCreateEntity> {}

export interface AddUserByEmailEntity {
	email: string;
}
