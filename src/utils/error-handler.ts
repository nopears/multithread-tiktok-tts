/**
 * Error Handling Utilities
 * Centralized error handling and logging
 */

import chalk from 'chalk'
import { ExitCode } from '../../types'

export class ErrorHandler {
	/**
	 * Handle and format application errors
	 */
	static handle(error: unknown, context?: string): never {
		const errorMessage = this.extractErrorMessage(error)
		const contextMessage = context ? `[${context}] ` : ''

		console.error(chalk.red(`\n💥 ${contextMessage}Error: ${errorMessage}\n`))

		// Determine appropriate exit code based on error type
		const exitCode = this.determineExitCode(error)
		process.exit(exitCode)
	}

	/**
	 * Extract meaningful error message from various error types
	 */
	private static extractErrorMessage(error: unknown): string {
		if (error instanceof Error) {
			return error.message
		}

		if (typeof error === 'string') {
			return error
		}

		if (error && typeof error === 'object' && 'message' in error) {
			return String(error.message)
		}

		return 'Unknown error occurred'
	}

	/**
	 * Determine appropriate exit code based on error type
	 */
	private static determineExitCode(error: unknown): ExitCode {
		if (error instanceof Error) {
			if (error.message.includes('session')) {
				return ExitCode.InvalidInput
			}
			if (
				error.message.includes('network') ||
				error.message.includes('fetch')
			) {
				return ExitCode.NetworkError
			}
			if (error.message.includes('too long')) {
				return ExitCode.TooLong
			}
			if (error.message.includes('exists')) {
				return ExitCode.ProjectExists
			}
		}

		return ExitCode.NetworkError
	}

	/**
	 * Log warning messages
	 */
	static warn(message: string, context?: string): void {
		const contextMessage = context ? `[${context}] ` : ''
		console.warn(chalk.yellow(`⚠️  ${contextMessage}${message}`))
	}

	/**
	 * Log info messages
	 */
	static info(message: string, context?: string): void {
		const contextMessage = context ? `[${context}] ` : ''
		console.info(chalk.blue(`ℹ️  ${contextMessage}${message}`))
	}

	/**
	 * Log success messages
	 */
	static success(message: string, context?: string): void {
		const contextMessage = context ? `[${context}] ` : ''
		console.log(chalk.green(`✅ ${contextMessage}${message}`))
	}

	/**
	 * Create a safe async wrapper that handles errors
	 */
	static async safeAsync<T>(
		operation: () => Promise<T>,
		context?: string,
		fallback?: T,
	): Promise<T | undefined> {
		try {
			return await operation()
		} catch (error) {
			this.warn(`Operation failed: ${this.extractErrorMessage(error)}`, context)
			return fallback
		}
	}
}
