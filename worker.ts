declare var self: Worker;

import { createAudioFromText } from "./utils"

// Handle incoming messages to the worker
self.onmessage = async (event: MessageEvent): Promise<void> => {
	try {
		await createAudioFromText(
			event.data.part,
			`output${event.data.number}/tts${event.data.i + 1}`,
			"en_uk_003",
			event.data.sessionId
		);
		self.postMessage(`Worker No.${event.data.i} done!`);
	} catch (error: unknown) {
		self.postMessage(`Worker No.${event.data.i} failed :(`);
	}
};

