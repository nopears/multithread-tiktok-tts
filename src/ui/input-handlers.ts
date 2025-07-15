/**
 * Input Handlers
 * Manages user input collection and validation
 */

import inquirer from 'inquirer'
import ora from 'ora'
import type { MenuAction } from '../../types'
import { AppConfig } from '../config/app.config'

export class InputHandlers {
	/**
	 * Show main menu and get user action
	 */
	static async getMainMenuAction(): Promise<MenuAction> {
		const { action } = await inquirer.prompt([
			{
				type: 'list',
				name: 'action',
				message: 'What would you like to do?',
				choices: [
					{
						name: '🎵 Generate TTS Audio',
						value: 'tts',
						short: 'TTS',
					},
					{
						name: '📋 Info Generator (WIP)',
						value: 'info',
						short: 'Info',
					},
					{
						name: '🚪 Exit',
						value: 'exit',
						short: 'Exit',
					},
				],
				pageSize: 10,
			},
		])
		return action
	}

	/**
	 * Get session ID from user
	 */
	static async getSessionId(): Promise<string> {
		const { EnvConfig } = await import('../config/env.config')
		
		// Check if session ID is available in environment
		const envSessionId = EnvConfig.getTikTokSessionId()
		if (envSessionId) {
			console.log('🔐 Using session ID from environment variables')
			return envSessionId
		}

		// If not in environment, ask user for source
		const { source } = await inquirer.prompt([
			{
				type: 'list',
				name: 'source',
				message: 'Session ID not found in .env file. How would you like to provide it?',
				choices: [
					{
						name: '📁 Load from sessionId.txt file',
						value: 'file',
						short: 'File',
					},
					{
						name: '⌨️  Enter manually',
						value: 'manual',
						short: 'Manual',
					},
					{
						name: '⚙️  Set up .env file (Recommended)',
						value: 'env',
						short: 'Environment',
					},
				],
			},
		])

		if (source === 'env') {
			console.log('\n📝 To set up environment variables:')
			console.log('1. Copy .env.example to .env')
			console.log('2. Edit .env and add your TikTok session ID')
			console.log('3. Restart the application\n')
			
			const { sessionId } = await inquirer.prompt([
				{
					type: 'password',
					name: 'sessionId',
					message: 'For now, enter your session ID manually:',
					mask: '*',
					validate: (input: string) => {
						if (!input.trim()) {
							return 'Session ID cannot be empty'
						}
						if (input.trim().length < 10) {
							return 'Session ID seems too short. Please check your input.'
						}
						return true
					},
				},
			])
			return sessionId.trim()
		} else if (source === 'file') {
			const spinner = ora('Loading session ID from file...').start()
			try {
				const sessionId = await Bun.file(AppConfig.files.sessionId).text()
				spinner.succeed('Session ID loaded successfully')
				return sessionId.trim()
			} catch (error) {
				spinner.fail('Failed to load session ID from file')
				throw new Error(
					'Could not read session ID file. Please ensure sessionId.txt exists.',
				)
			}
		} else {
			const { sessionId } = await inquirer.prompt([
				{
					type: 'password',
					name: 'sessionId',
					message: 'Enter your TikTok session ID:',
					mask: '*',
					validate: (input: string) => {
						if (!input.trim()) {
							return 'Session ID cannot be empty'
						}
						if (input.trim().length < 10) {
							return 'Session ID seems too short. Please check your input.'
						}
						return true
					},
				},
			])
			return sessionId.trim()
		}
	}

	/**
	 * Get text input from user
	 */
	static async getTextInput(): Promise<string> {
		const { source } = await inquirer.prompt([
			{
				type: 'list',
				name: 'source',
				message: 'How would you like to provide the text?',
				choices: [
					{
						name: '📁 Load from input.txt file',
						value: 'file',
						short: 'File',
					},
					{
						name: '⌨️  Enter text manually',
						value: 'manual',
						short: 'Manual',
					},
				],
			},
		])

		if (source === 'file') {
			const spinner = ora('Loading text from file...').start()
			try {
				const text = await Bun.file(AppConfig.files.input).text()
				spinner.succeed(`Loaded ${text.length} characters from file`)
				return text
			} catch (error) {
				spinner.fail('Failed to load text from file')
				throw new Error(
					'Could not read input file. Please ensure input.txt exists.',
				)
			}
		} else {
			const { inputText } = await inquirer.prompt([
				{
					type: 'editor',
					name: 'inputText',
					message: 'Enter the text you want to convert to speech:',
					validate: (input: string) => {
						if (!input.trim()) {
							return 'Text cannot be empty'
						}
						if (input.length > 10000) {
							return 'Text is too long (maximum 10,000 characters)'
						}
						return true
					},
				},
			])
			return inputText
		}
	}

	/**
	 * Get project details from user
	 */
	static async getProjectDetails(): Promise<{
		projectNum: string
		fileName: string
	}> {
		return await inquirer.prompt([
			{
				type: 'input',
				name: 'projectNum',
				message: 'Enter project number:',
				validate: (input: string) => {
					const num = Number(input)
					if (isNaN(num) || num <= 0) {
						return 'Please enter a valid positive number'
					}
					return true
				},
			},
			{
				type: 'input',
				name: 'fileName',
				message: 'Enter output file name (without extension):',
				default: 'output',
				validate: (input: string) => {
					if (!input.trim()) {
						return 'File name cannot be empty'
					}
					if (!/^[a-zA-Z0-9_-]+$/.test(input.trim())) {
						return 'File name can only contain letters, numbers, hyphens, and underscores'
					}
					return true
				},
			},
		])
	}

	/**
	 * Ask for confirmation
	 */
	static async getConfirmation(
		message: string,
		defaultValue = false,
	): Promise<boolean> {
		const { confirmed } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'confirmed',
				message,
				default: defaultValue,
			},
		])
		return confirmed
	}

	/**
	 * Get voice selection from user
	 */
	static async getVoiceSelection(): Promise<string> {
		const {
			AVAILABLE_VOICES,
			getAllCategories,
			getVoicesByCategory,
			getPopularVoices,
		} = await import('../config/voices.config')

		const { selectionType } = await inquirer.prompt([
			{
				type: 'list',
				name: 'selectionType',
				message: 'How would you like to choose a voice?',
				choices: [
					{
						name: '⭐ Popular Voices (Recommended)',
						value: 'popular',
						short: 'Popular',
					},
					{
						name: '📂 Browse by Category',
						value: 'category',
						short: 'Category',
					},
					{
						name: '📋 View All Voices',
						value: 'all',
						short: 'All',
					},
				],
			},
		])

		let selectedVoices = AVAILABLE_VOICES

		if (selectionType === 'popular') {
			selectedVoices = getPopularVoices()
		} else if (selectionType === 'category') {
			const { category } = await inquirer.prompt([
				{
					type: 'list',
					name: 'category',
					message: 'Select a voice category:',
					choices: getAllCategories().map((cat) => ({
						name: cat,
						value: cat,
					})),
					pageSize: 15,
				},
			])
			selectedVoices = getVoicesByCategory(category)
		}

		const { voiceCode } = await inquirer.prompt([
			{
				type: 'list',
				name: 'voiceCode',
				message: 'Select a voice:',
				choices: selectedVoices.map((voice) => ({
					name: `${voice.name} (${voice.language}) - ${voice.code}`,
					value: voice.code,
					short: voice.name,
				})),
				pageSize: 15,
			},
		])

		return voiceCode
	}

	/**
	 * Ask if user wants to continue
	 */
	static async askToContinue(): Promise<boolean> {
		return this.getConfirmation(
			'Would you like to perform another action?',
			true,
		)
	}
}
