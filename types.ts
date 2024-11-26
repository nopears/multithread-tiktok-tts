export interface WorkerData {
	i: number
	part: string
	number: number
	sessionId: string
}

export interface AudioChunk {
	index: number
	result: string
	msg: string
}

export enum ExitCode {
	Success = 0,
	TooLong = 2,
	ProjectExists = 3,
}
