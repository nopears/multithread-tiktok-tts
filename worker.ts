declare var self: Worker;

// Import the text-to-speech module
// @ts-ignore
import { createAudioFromText, config } from "tiktok-tts";

// Handle incoming messages to the worker
self.onmessage = async (event: MessageEvent): Promise<void> => {
	try {
		await config(event.data.sessionId);
		await createAudioFromText(
			event.data.part,
			`output${event.data.number}/tts${event.data.i + 1}`,
			"en_uk_003"
		);
		self.postMessage(`Worker No.${event.data.i} done!`);
	} catch (error: unknown) {
		self.postMessage(`Worker No.${event.data.i} failed :(`);
	}
};

