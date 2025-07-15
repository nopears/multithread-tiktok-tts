/**
 * Application Configuration
 * Centralized configuration management for the TTS Generator
 */

import os from 'os'

// Get environment-aware configuration
function getAppConfig() {
	return {
		// File paths
		files: {
			input: 'input.txt',
			sessionId: 'sessionId.txt',
		},

		// TTS API Configuration
		api: {
			baseUrl: process.env.TTS_API_BASE_URL || 'https://api16-normal-v6.tiktokv.com/media/api/text/speech/invoke',
			defaultVoice: process.env.DEFAULT_VOICE_CODE || 'en_us_002', // Jessie - popular and clear voice
			userAgent: 'com.zhiliaoapp.musically/2022600030 (Linux; U; Android 7.1.2; es_ES; SM-G988N; Build/NRD90M;tt-ok/3.12.13.1)',
		},

		// Performance settings (environment-aware)
		performance: {
			maxChunkLength: Number(process.env.MAX_CHUNK_LENGTH) || 200,
			maxWorkers: Math.min(Number(process.env.MAX_WORKERS) || os.cpus().length, os.cpus().length),
			rateLimitDelay: Number(process.env.RATE_LIMIT_DELAY) || 50, // ms between requests
			maxCacheSize: Number(process.env.MAX_CACHE_SIZE) || 1000,
		},

		// UI Configuration
		ui: {
			banner: {
				font: 'ANSI Shadow' as const,
				colors: ['cyan', 'magenta'] as const,
			},
			progressBar: {
				format:
					'🎵 Processing |{bar}| {percentage}% | {value}/{total} chunks | ETA: {eta}s',
				completeChar: '█',
				incompleteChar: '░',
			},
		},
	} as const
}

export const AppConfig = getAppConfig()

export type AppConfigType = typeof AppConfig
