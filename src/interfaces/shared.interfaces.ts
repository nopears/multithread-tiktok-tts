/**
 * Shared Interfaces
 * Common interfaces used across the application
 */

export interface ApiResponse<T = any> {
	success: boolean
	data?: T
	error?: string
	statusCode?: number
}

export interface CacheEntry<T = any> {
	data: T
	timestamp: number
	ttl?: number
}

export interface ValidationResult {
	isValid: boolean
	error?: string
	warnings?: string[]
}

export interface ConfigValidation {
	isValid: boolean
	errors: string[]
	warnings?: string[]
}