/**
 * TTS API Service
 * Handles all interactions with the TikTok TTS API
 */

import { AppConfig } from '../config/app.config'

export class TTSApiService {
	private static cache = new Map<string, string>()
	private static lastRequestTime = 0

	/**
	 * Prepare text for API request by encoding special characters
	 */
	private static prepareText(text: string): string {
		return text.replace(/\+/g, 'plus').replace(/\s/g, '+').replace(/&/g, 'and')
	}

	/**
	 * Handle API error responses
	 */
	private static handleStatusError(statusCode: number): never {
		const errorMessages = {
			1: 'Your TikTok session ID might be invalid or expired. Try getting a new one.',
			2: 'The provided text is too long.',
			4: 'Invalid speaker, please check the list of valid speaker values.',
			5: 'No session ID found.',
		}

		const message =
			errorMessages[statusCode as keyof typeof errorMessages] ||
			'Unknown error occurred'
		throw new Error(`${message} (status_code: ${statusCode})`)
	}

	/**
	 * Rate limiting to avoid overwhelming the API
	 */
	private static async rateLimit(): Promise<void> {
		const now = Date.now()
		const timeSinceLastRequest = now - this.lastRequestTime

		if (timeSinceLastRequest < AppConfig.performance.rateLimitDelay) {
			const delay = AppConfig.performance.rateLimitDelay - timeSinceLastRequest
			await new Promise((resolve) => setTimeout(resolve, delay))
		}

		this.lastRequestTime = Date.now()
	}

	/**
	 * Create audio from text using TikTok TTS API
	 */
	static async createAudioFromText(
		text: string,
		sessionId: string,
		voice: string = AppConfig.api.defaultVoice,
	): Promise<string | null> {
		// Create cache key for duplicate text detection
		const cacheKey = `${voice}:${text}`

		// Check cache first for performance
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey)!
		}

		// Apply rate limiting
		await this.rateLimit()

		const preparedText = this.prepareText(text)
		const url = `${AppConfig.api.baseUrl}/?text_speaker=${voice}&req_text=${preparedText}&speaker_map_type=0&aid=1233`

		const headers = {
			'User-Agent': AppConfig.api.userAgent,
			Cookie: `sessionid=${sessionId}`,
			'Accept-Encoding': 'gzip,deflate,compress',
		}

		try {
			const response = await fetch(url, { method: 'POST', headers })
			const data = await response.json()

			const statusCode = data?.status_code
			if (statusCode !== 0) {
				this.handleStatusError(statusCode)
			}

			const audioData = data?.data?.v_str

			// Cache successful responses (with size limit to prevent memory issues)
			if (audioData && this.cache.size < AppConfig.performance.maxCacheSize) {
				this.cache.set(cacheKey, audioData)
			}

			return audioData || null
		} catch (error) {
			if (error instanceof Error && error.message.includes('status_code')) {
				throw error
			}
			throw new Error(`TTS API request failed: ${error}`)
		}
	}

	/**
	 * Get cache statistics
	 */
	static getCacheStats() {
		return {
			size: this.cache.size,
			maxSize: AppConfig.performance.maxCacheSize,
		}
	}

	/**
	 * Clear the cache
	 */
	static clearCache(): void {
		this.cache.clear()
	}
}
