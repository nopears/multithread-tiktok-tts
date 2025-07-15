/**
 * Core Types and Interfaces
 * Type definitions for the TTS Generator application
 */

export interface WorkerData {
	i: number
	part: string
	number: number
	sessionId: string
	voiceCode: string
}

export interface AudioChunk {
	index: number
	result: string | null
	msg: string
}

export interface ProcessingResult {
	index: number
	result: string | null
	msg: string
	success: boolean
}

export interface TTSProcessingOptions {
	sessionId: string
	textChunks: string[]
	projectNumber: number
	fileName: string
	outputDir: string
	voiceCode: string
}

export interface PerformanceMetrics {
	totalChunks: number
	successfulChunks: number
	failedChunks: number
	cacheHitRate: number
	totalFileSize: number
	processingTime: number
}

export interface UserInputs {
	sessionSource: 'file' | 'manual'
	textSource: 'file' | 'manual'
	projectNum: string
	fileName: string
	sessionId?: string
	inputText?: string
}

export enum ExitCode {
	Success = 0,
	TooLong = 2,
	ProjectExists = 3,
	InvalidInput = 4,
	NetworkError = 5,
}

export enum ProcessingStatus {
	Pending = 'pending',
	Processing = 'processing',
	Success = 'success',
	Failed = 'failed',
}

export type MenuAction = 'tts' | 'info' | 'exit'
