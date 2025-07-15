/**
 * Text Processing Utilities
 * Handles text chunking and processing operations
 */

import { AppConfig } from '../config/app.config'

export class TextProcessor {
	/**
	 * Split text into optimally sized chunks for TTS processing
	 */
	static splitIntoChunks(
		text: string,
		maxLength: number = AppConfig.performance.maxChunkLength,
	): string[] {
		if (!text.trim()) {
			throw new Error('Text cannot be empty')
		}

		const chunks: string[] = []
		const words = text.trim().split(/\s+/)
		let currentChunk = ''
		let currentLength = 0

		for (const word of words) {
			const wordLength = word.length
			const spaceLength = currentLength > 0 ? 1 : 0

			// Check if adding this word would exceed the limit
			if (
				currentLength + spaceLength + wordLength > maxLength &&
				currentLength > 0
			) {
				chunks.push(currentChunk)
				currentChunk = word
				currentLength = wordLength
			} else {
				if (currentLength > 0) {
					currentChunk += ' '
					currentLength += 1
				}
				currentChunk += word
				currentLength += wordLength
			}
		}

		if (currentChunk.length > 0) {
			chunks.push(currentChunk)
		}

		return chunks
	}

	/**
	 * Validate text input
	 */
	static validateText(text: string): { isValid: boolean; error?: string } {
		if (!text || !text.trim()) {
			return { isValid: false, error: 'Text cannot be empty' }
		}

		if (text.length > 10000) {
			return {
				isValid: false,
				error: 'Text is too long (maximum 10,000 characters)',
			}
		}

		return { isValid: true }
	}

	/**
	 * Get text statistics
	 */
	static getTextStats(text: string) {
		const words = text.trim().split(/\s+/)
		const chunks = this.splitIntoChunks(text)

		return {
			characters: text.length,
			words: words.length,
			chunks: chunks.length,
			averageChunkSize: Math.round(text.length / chunks.length),
		}
	}

	/**
	 * Clean and normalize text for processing
	 */
	static cleanText(text: string): string {
		return text
			.trim()
			.replace(/\s+/g, ' ') // Normalize whitespace
			.replace(/[^\w\s.,!?;:'"()-]/g, '') // Remove special characters that might cause issues
	}
}
