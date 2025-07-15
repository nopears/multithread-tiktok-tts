/**
 * TTS Controller
 * Main controller for TTS processing operations
 */

import { exists, mkdir } from 'node:fs/promises'
import boxen from 'boxen'
import chalk from 'chalk'
import cliProgress from 'cli-progress'
import ora from 'ora'

import type {
	PerformanceMetrics,
	ProcessingResult,
	TTSProcessingOptions,
} from '../../types'
import { AppConfig } from '../config/app.config'
import { TTSApiService } from '../services/tts-api.service'
import { WorkerPoolService } from '../services/worker-pool.service'
import { BannerUI } from '../ui/banner'
import { InputHandlers } from '../ui/input-handlers'
import { TextProcessor } from '../utils/text-processor'

export class TTSController {
	/**
	 * Main TTS processing workflow
	 */
	static async process(): Promise<void> {
		BannerUI.showSectionHeader(
			'🎵 Text-to-Speech Generator',
			'Convert your text into high-quality audio files',
		)

		try {
			// Collect user inputs
			const sessionId = await InputHandlers.getSessionId()
			const rawText = await InputHandlers.getTextInput()
			const { projectNum, fileName } = await InputHandlers.getProjectDetails()
			const voiceCode = await InputHandlers.getVoiceSelection()

			// Process and validate text
			const cleanText = TextProcessor.cleanText(rawText)
			const validation = TextProcessor.validateText(cleanText)

			if (!validation.isValid) {
				throw new Error(validation.error)
			}

			const textChunks = TextProcessor.splitIntoChunks(cleanText)
			const textStats = TextProcessor.getTextStats(cleanText)

			// Show selected voice info
			const { getVoiceByCode } = await import('../config/voices.config')
			const selectedVoice = getVoiceByCode(voiceCode)
			const voiceInfo = selectedVoice ? `${selectedVoice.name} (${selectedVoice.language})` : voiceCode

			console.log(
				chalk.blue(
					`\n📝 Text processed: ${textStats.characters} chars, ${textStats.words} words, ${textStats.chunks} chunks`,
				),
			)
			console.log(
				chalk.green(
					`🎤 Selected voice: ${voiceInfo}\n`,
				),
			)

			// Setup processing options
			const outputDir = `output${projectNum}`
			const options: TTSProcessingOptions = {
				sessionId,
				textChunks,
				projectNumber: Number(projectNum),
				fileName: fileName.trim(),
				outputDir,
				voiceCode,
			}

			// Check if project exists
			await this.handleExistingProject(outputDir)

			// Create output directory
			await this.createOutputDirectory(outputDir)

			// Process audio chunks
			const results = await this.processAudioChunks(options)

			// Combine and save audio file
			const outputPath = await this.combineAudioFiles(results, options)

			// Show results and metrics
			await this.showResults(results, outputPath, textStats.chunks)
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error occurred'
			BannerUI.showError('TTS process failed!', errorMessage)
		}
	}

	/**
	 * Handle existing project directory
	 */
	private static async handleExistingProject(outputDir: string): Promise<void> {
		if (await exists(outputDir)) {
			const overwrite = await InputHandlers.getConfirmation(
				`Project directory '${outputDir}' already exists. Do you want to overwrite it?`,
				false,
			)

			if (!overwrite) {
				BannerUI.showWarning('Operation cancelled by user')
				return
			}
		}
	}

	/**
	 * Create output directory
	 */
	private static async createOutputDirectory(outputDir: string): Promise<void> {
		const spinner = ora('Creating output directory...').start()
		try {
			await mkdir(outputDir, { recursive: true })
			spinner.succeed('Output directory created')
		} catch (error) {
			spinner.fail('Failed to create output directory')
			throw error
		}
	}

	/**
	 * Process audio chunks using worker pool
	 */
	private static async processAudioChunks(
		options: TTSProcessingOptions,
	): Promise<ProcessingResult[]> {
		console.log(chalk.blue('\n🚀 Starting TTS processing...\n'))

		const progressBar = new cliProgress.SingleBar(
			{
				format: AppConfig.ui.progressBar.format,
				barCompleteChar: AppConfig.ui.progressBar.completeChar,
				barIncompleteChar: AppConfig.ui.progressBar.incompleteChar,
				hideCursor: true,
			},
			cliProgress.Presets.shades_classic,
		)

		progressBar.start(options.textChunks.length, 0)

		// Create worker pool with optimal size
		const workerPool = new WorkerPoolService(
			Math.min(AppConfig.performance.maxWorkers, options.textChunks.length),
			'./worker.ts',
		)

		try {
			// Process chunks sequentially in batches for better progress tracking
			const results: ProcessingResult[] = []
			const batchSize = Math.min(AppConfig.performance.maxWorkers, 5) // Process in smaller batches

			for (let i = 0; i < options.textChunks.length; i += batchSize) {
				const batch = options.textChunks.slice(i, i + batchSize)

				const batchPromises = batch.map(async (chunk, batchIndex) => {
					const globalIndex = i + batchIndex
					try {
						const result = await workerPool.execute({
							i: globalIndex,
							part: chunk,
							number: options.projectNumber,
							sessionId: options.sessionId,
							voiceCode: options.voiceCode,
						})

						return {
							...result,
							success: result.result !== null,
						} as ProcessingResult
					} catch (error) {
						return {
							index: globalIndex,
							result: null,
							msg: `Chunk ${globalIndex} failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
							success: false,
						} as ProcessingResult
					}
				})

				// Wait for current batch to complete
				const batchResults = await Promise.all(batchPromises)
				results.push(...batchResults)

				// Update progress bar after each batch
				progressBar.update(results.length)
			}

			progressBar.stop()

			// Sort results by index
			return results.sort((a, b) => a.index - b.index)
		} finally {
			workerPool.terminate()
		}
	}

	/**
	 * Combine audio files into single output
	 */
	private static async combineAudioFiles(
		results: ProcessingResult[],
		options: TTSProcessingOptions,
	): Promise<string> {
		const combineSpinner = ora('Combining audio files...').start()
		const outputPath = `${options.outputDir}/${options.fileName}.mp3`

		try {
			// Pre-allocate buffer array for better performance
			const audioBuffers: Buffer[] = []
			let totalSize = 0

			// Process successful results
			for (const result of results) {
				if (result.result) {
					const buffer = Buffer.from(result.result, 'base64')
					audioBuffers.push(buffer)
					totalSize += buffer.length
				}
			}

			// Write combined audio file
			if (audioBuffers.length > 0) {
				const combinedBuffer = Buffer.concat(audioBuffers, totalSize)
				await Bun.write(outputPath, combinedBuffer)
				combineSpinner.succeed(`Audio file saved as: ${outputPath}`)
			} else {
				combineSpinner.fail('No audio data to combine')
				throw new Error('No successful audio chunks were generated')
			}

			return outputPath
		} catch (error) {
			combineSpinner.fail('Failed to combine audio files')
			throw error
		}
	}

	/**
	 * Display processing results and metrics
	 */
	private static async showResults(
		results: ProcessingResult[],
		outputPath: string,
		totalChunks: number,
	): Promise<void> {
		// Format results table
		this.formatResultsTable(results.map((r) => r.msg))

		// Calculate metrics
		const metrics = this.calculateMetrics(results, totalChunks)

		// Show success summary
		const summaryContent = [
			`📁 Output: ${outputPath}`,
			`📊 Processed: ${metrics.totalChunks} text chunks`,
			`✅ Successful: ${metrics.successfulChunks} chunks`,
			metrics.failedChunks > 0
				? `⚠️  Failed: ${metrics.failedChunks} chunks`
				: null,
			`🚀 Cache hits: ${metrics.cacheHitRate}% (${TTSApiService.getCacheStats().size} cached)`,
			`💾 File size: ${Math.round(metrics.totalFileSize / 1024)} KB`,
		]
			.filter(Boolean)
			.join('\n')

		BannerUI.showSuccess('TTS process completed successfully!', summaryContent)
	}

	/**
	 * Format and display results table
	 */
	private static formatResultsTable(results: string[]): void {
		const tableData = results.map((result, index) => {
			let status = '⚠️' // Default warning

			if (result.includes('done!') || result.includes('success')) {
				status = '✅' // Success
			} else if (result.includes('failed') || result.includes('error')) {
				status = '❌' // Error
			}

			return {
				index: (index + 1).toString(),
				result: result.length > 50 ? result.substring(0, 47) + '...' : result,
				status,
			}
		})

		console.log(
			'\n' +
				boxen(
					tableData
						.map(
							(row) =>
								`${row.status} ${chalk.cyan(row.index.padStart(3))} │ ${row.result}`,
						)
						.join('\n'),
					{
						title: '📊 Processing Results',
						titleAlignment: 'center',
						padding: 1,
						margin: 1,
						borderStyle: 'round',
						borderColor: 'green',
					},
				),
		)
	}

	/**
	 * Calculate performance metrics
	 */
	private static calculateMetrics(
		results: ProcessingResult[],
		totalChunks: number,
	): PerformanceMetrics {
		const successfulChunks = results.filter((r) => r.success).length
		const failedChunks = results.length - successfulChunks
		const cacheStats = TTSApiService.getCacheStats()
		const cacheHitRate =
			cacheStats.size > 0
				? Math.round((cacheStats.size / results.length) * 100)
				: 0

		// Calculate total file size from successful results
		const totalFileSize = results
			.filter((r) => r.result)
			.reduce((total, r) => total + Buffer.from(r.result!, 'base64').length, 0)

		return {
			totalChunks,
			successfulChunks,
			failedChunks,
			cacheHitRate,
			totalFileSize,
			processingTime: 0, // Could be implemented with timing
		}
	}
}
