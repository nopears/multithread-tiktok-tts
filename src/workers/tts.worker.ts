/**
 * TTS Worker
 * Web Worker for processing TTS requests in parallel
 */

declare const self: Worker

import { TTSApiService } from '../services/tts-api.service'
import type { AudioChunk, WorkerData } from '../types/core.types'

/**
 * Handle incoming messages from the main thread
 */
self.onmessage = async (event: MessageEvent<WorkerData>): Promise<void> => {
	const { i: index, part: text, sessionId, voiceCode } = event.data

	try {
		// Process the text chunk using TTS API with selected voice
		const audioData = await TTSApiService.createAudioFromText(
			text,
			sessionId,
			voiceCode,
		)

		// Send success response
		const response: AudioChunk = {
			msg: `Worker No.${index} completed successfully!`,
			index,
			result: audioData || null,
		}

		self.postMessage(response)
	} catch (error: unknown) {
		// Send error response
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error'
		const response: AudioChunk = {
			msg: `Worker No.${index} failed: ${errorMessage}`,
			index,
			result: null,
		}

		self.postMessage(response)
	}
}

/**
 * Handle worker errors
 */
self.onerror = (error: ErrorEvent): void => {
	console.error('Worker error:', error)
}