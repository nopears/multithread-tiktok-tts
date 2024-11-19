import { exists, mkdir, appendFile } from "node:fs/promises";
import os from "os"
import chalk from "chalk";
import type { WorkerData } from './types';
import { ExitCode } from './types';

const INPUT_FILE_PATH = "input.txt";
const SESSION_FILE_PATH = "sessionId.txt";
const MAX_CHUNK_LENGTH = 200;
const THREADS = os.cpus().length
let BASE_URL = 'https://api16-normal-v6.tiktokv.com/media/api/text/speech/invoke';
const DEFAULT_VOICE = 'en_us_001';

export const askQuestion = (question: string): string => {
	return prompt(chalk.blue.bold(question)) ?? "No input provided";
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
		return askQuestion("Enter sessionId: ");
	} else {
		throw new Error("Invalid choice");
	}
};

const getTextParts = async (text?: string): Promise<string[]> => {
	return splitTextIntoChunks(text || await Bun.file(INPUT_FILE_PATH).text(), MAX_CHUNK_LENGTH);
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

const runService = async (data: WorkerData): Promise<{ index: number; result: string, msg: string }> => {
	return new Promise((resolve, reject) => {
		const worker = new Worker("./worker.ts");
		worker.onmessage = (msg: MessageEvent<{ index: number; result: string, msg: string }>): void => { resolve(msg.data); };
		worker.onerror = (err: ErrorEvent): void => { reject(err); };
		worker.postMessage(data);
	});
};

const createRuns = (parts: string[], number: number, sessionId: string): Promise<{ index: number; result: string, msg: string }[]> => {
	const promiseArray: Promise<{ index: number; result: string, msg: string }>[] = [];
	const chunkSize = Math.ceil(parts.length / THREADS);
	for (let i = 0; i < THREADS; i++) {
		const chunk = parts.slice(i * chunkSize, (i + 1) * chunkSize);
		for (let j = 0; j < chunk.length; j++) {
			promiseArray.push(runService({ i: i * chunkSize + j, part: chunk[j], number, sessionId }));
		}
	}
	return Promise.all(promiseArray);
};

export const TTS = async (): Promise<void> => {
	const choice = Number(askQuestion("sessionId in\n1: file\n2: prompt\n"));

	console.log(chalk.green('-------------------------------------'));

	const sessionId: string = await getSessionId(choice)

	const inputChoice = Number(askQuestion("text from\n1: file\n2: prompt\n"))

	let parts: string[] = []

	if (inputChoice === 2) {
		parts = await getTextParts(askQuestion(""))
	} else {
		parts = await getTextParts()
	}

	const projectNum = askQuestion("Enter project number: ");

	if (await exists(`output${projectNum}`)) process.exit(ExitCode.ProjectExists);

	await mkdir(`output${projectNum}`);

	const results = await createRuns(parts, Number(projectNum), sessionId);

	results.sort((a, b) => a.index - b.index);

	for (const result of results) {
		if (result.result) {
			await appendFile(`output${projectNum}/tts.mp3`, Buffer.from(result.result, 'base64'));
		}
	}

	const resultMessages = results.map(result => result.msg);
	formatResultsAsTable(resultMessages);

	console.log(chalk.green('TTS process completed.'));
};

export const showBanner = (): void => {
	console.log(chalk.green('-------------------------------------'));
	console.log(chalk.green('Welcome to @nopears TTS generator!'));
	console.log(chalk.green('-------------------------------------'));
};

export const showMenu = async (): Promise<void> => {
	console.log(chalk.yellow('Choose action'));
	console.log('1: TTS');
	console.log('2: Info generator');
};

const prepareText = (text: string): string => {
	text = text.replace('+', 'plus');
	text = text.replace(/\s/g, '+');
	text = text.replace('&', 'and');
	return text;
}

const handleStatusError = (status_code: number): void => {
	switch (status_code) {
		case 1:
			throw new Error(`Your TikTok session id might be invalid or expired. Try getting a new one. status_code: ${status_code}`);
		case 2:
			throw new Error(`The provided text is too long. status_code: ${status_code}`);
		case 4:
			throw new Error(`Invalid speaker, please check the list of valid speaker values. status_code: ${status_code}`);
		case 5:
			throw new Error(`No session id found. status_code: ${status_code}`);
		default:
			throw new Error(`Unknown status code: ${status_code}`);
	}
}

export const createAudioFromText = async (text: string = '', text_speaker: string = DEFAULT_VOICE, sessionId: string): Promise<string | void> => {
	const req_text = prepareText(text);
	const URL = `${BASE_URL}/?text_speaker=${text_speaker}&req_text=${req_text}&speaker_map_type=0&aid=1233`;
	const headers = {
		'User-Agent': 'com.zhiliaoapp.musically/2022600030 (Linux; U; Android 7.1.2; es_ES; SM-G988N; Build/NRD90M;tt-ok/3.12.13.1)',
		'Cookie': `sessionid=${sessionId}`,
		'Accept-Encoding': 'gzip,deflate,compress'
	}

	try {
		const response = await (await fetch(URL, { method: 'POST', headers })).json();
		const status_code = response?.status_code;
		if (status_code !== 0) return handleStatusError(status_code);
		return response?.data?.v_str;
	} catch (err) {
		throw new Error(`tiktok-tts ${err}`);
	}
}
