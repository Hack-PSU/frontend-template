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

// Other utility interfaces
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
