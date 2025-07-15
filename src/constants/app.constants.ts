/**
 * Application Constants
 * Centralized constants for the TTS Generator application
 */

export const APP_CONFIG = {
	NAME: 'TTS Generator',
	VERSION: '1.0.0',
	DESCRIPTION: 'Text-to-Speech Generator CLI Application',
} as const

export const FILE_EXTENSIONS = {
	AUDIO: '.mp3',
	TEXT: '.txt',
	CONFIG: '.env',
} as const

export const LIMITS = {
	MAX_TEXT_LENGTH: 5000,
	MAX_CHUNK_SIZE: 300,
	MAX_WORKERS: 10,
	RETRY_ATTEMPTS: 3,
} as const

export const MESSAGES = {
	WELCOME: '🎵 Welcome to TTS Generator!',
	PROCESSING: '⚡ Processing your text...',
	SUCCESS: '✅ Audio generation completed successfully!',
	ERROR: '❌ An error occurred during processing',
} as const