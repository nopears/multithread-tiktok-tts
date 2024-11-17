import { exists, mkdir } from "node:fs/promises";
import clear from "clear";
import readline from 'readline';
import os from "os"
import type { WorkerData } from "./types"
import chalk from "chalk";

const INPUT_FILE_PATH = "input.txt";
const SESSION_FILE_PATH = "sessionId.txt";
const MAX_CHUNK_LENGTH = 200;

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const askQuestion = (question: string): Promise<string> => {
	return new Promise((resolve: (value: string | PromiseLike<string>) => void): void => {
		rl.question(chalk.blue.bold(question), (answer: string): void => {
			resolve(answer);
		});
	});
};

const formatResultsAsTable = (results: string[]): void => {
	console.log('-------------------------------------');
	console.log("| Index | Result                    |");
	console.log('-------------------------------------');
	for (let i = 0; i < results.length; i++) {
		const index = `| ${i + 1} `.padEnd(8, ' ');
		const result = `| ${results[i]}`.padEnd(28, ' ');
		console.log(index + result + "|");
	}
	console.log('-------------------------------------');
}

const getSessionId = async (choice: number): Promise<string> => {
	if (choice === 1) {
		return await Bun.file(SESSION_FILE_PATH).text();
	} else if (choice === 2) {
		return await askQuestion("Enter sessionId: ");
	} else {
		throw new Error("Invalid choice");
	}
};

const getTextParts = async (text?: string): Promise<string[]> => {
	return splitTextIntoChunks(text ? text : await Bun.file(INPUT_FILE_PATH).text(), MAX_CHUNK_LENGTH);
}

const splitTextIntoChunks = (text: string, maxLength: number): string[] => {
	const chunks: string[] = [];
	let currentChunk = "";

	for (const word of text.split(' ')) {
		if ((currentChunk + word).length <= maxLength) {
			currentChunk += `${word} `;
		} else {
			chunks.push(currentChunk.trim());
			currentChunk = `${word} `;
		}
	}
	if (currentChunk.length > 0) {
		chunks.push(currentChunk.trim());
	}
	return chunks;
};


enum ExitCode {
	Success = 0,
	TooLong = 2,
	ProjectExists = 3,
}

process.on("exit", (code: number): void => {
	switch (code) {
		case ExitCode.Success:
			break;
		case ExitCode.TooLong:
			console.log(chalk.red('Input lines are too long!'));
			break;
		case ExitCode.ProjectExists:
			console.log(chalk.red('Project already exists!'));
			break;
	}
});

const threads = os.cpus().length

const TTS = async (): Promise<void> => {
	const choice = Number(await askQuestion("sessionId in\n1: file\n2: prompt\n"));

	console.log(chalk.green('-------------------------------------'));

	const sessionId: string = await getSessionId(choice)

	const inputChoice = Number(await askQuestion("text from\n1: file\n2: prompt\n"))

	let parts: string[] = []

	if (inputChoice === 2) {
		parts = await getTextParts(await askQuestion(""))

	} else {
		parts = await getTextParts()
	}

	for (let i = 0; i < parts.length; i++) {
		if (parts[i].length > 200) process.exit(2);
	}

	const projectNum = await askQuestion("Enter project number: ");

	if (await exists(`output${projectNum}`)) process.exit(3);

	await mkdir(`output${projectNum}`);

	const runService = async (data: WorkerData): Promise<string> => {
		return new Promise((resolve: (value: string | PromiseLike<string>) => void, reject: (reason?: any) => void): void => {
			const worker = new Worker("./worker.ts");
			worker.onmessage = (msg: MessageEvent<string>): void => { resolve(msg.data); };
			worker.onerror = (err: ErrorEvent): void => { reject(err); };
			worker.postMessage(data);
		});
	}

	const createRuns = (parts: string[], number: number, sessionId: string): Promise<string[]> => {
		const promiseArray: Promise<string>[] = [];
		const chunkSize = Math.ceil(parts.length / threads);
		for (let i = 0; i < threads; i++) {
			const chunk = parts.slice(i * chunkSize, (i + 1) * chunkSize);
			for (let j = 0; j < chunk.length; j++) {
				promiseArray.push(runService({ i: i * chunkSize + j, part: chunk[j], number, sessionId }));
			}
		}
		return Promise.all(promiseArray);
	}

	const results = await createRuns(parts, Number(projectNum), sessionId);
	formatResultsAsTable(results);
};

const showBanner = (): void => {
	console.log(chalk.green('-------------------------------------'));
	console.log(chalk.green('Welcome to @nopears TTS generator!'));
	console.log(chalk.green('-------------------------------------'));
};

const showMenu = async (): Promise<void> => {
	console.log(chalk.yellow('Choose action'));
	console.log('1: TTS');
	console.log('2: Info generator');
};

const main = async (): Promise<void> => {
	showBanner();
	while (true) {
		await showMenu();
		const choice = Number(await askQuestion('Enter your choice: '));
		if (choice === 1) {
			console.log(chalk.green('TTS selected'));
			await TTS()
		} else if (choice === 2) {
			console.log(chalk.hex("#754824").bold("WIP"))
		} else {
			console.log(chalk.red('Invalid choice, please try again.'));
		}
		const continueChoice = await askQuestion('Do you want to continue? y/n: ');
		if (continueChoice.toLowerCase() !== 'y') {
			break;
		}
	}
	rl.close();
	console.log(chalk.green('Bye!'));
};

await main();
await Bun.sleep(1000);
clear();
process.exit(0)

