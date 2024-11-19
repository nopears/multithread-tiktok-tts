declare var self: Worker;

import { createAudioFromText } from "./utils"

self.onmessage = async (event: MessageEvent): Promise<void> => {
	try {
		const data = await createAudioFromText(
			event.data.part,
			"en_uk_003",
			event.data.sessionId
		);
		self.postMessage({ msg: `Worker No.${event.data.i} done!`, index: event.data.i, result: data });
	} catch (error: unknown) {
		self.postMessage({ msg: `Worker No.${event.data.i} failed :(`, index: event.data.i, result: null });
	}
};

