export interface WorkerData {
	i: number;
	part: string;
	number: number;
	sessionId: string;
}

export enum ExitCode {
	Success = 0,
	TooLong = 2,
	ProjectExists = 3,
}

