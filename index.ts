/**
 * TTS Generator Application
 * Main entry point for the Text-to-Speech Generator CLI application
 */

import chalk from 'chalk'
import clear from 'clear'
import { TTSController } from './src/controllers/tts.controller'
import { BannerUI } from './src/ui/banner'
import { InputHandlers } from './src/ui/input-handlers'
import { ExitCode } from './types'

/**
 * Application class to manage the main application flow
 */
class TTSGeneratorApp {
	private isRunning = true

	/**
	 * Initialize the application
	 */
	async initialize(): Promise<void> {
		this.setupExitHandlers()
		clear()
		await BannerUI.show()
		await this.validateEnvironment()
	}

	/**
	 * Validate environment configuration
	 */
	private async validateEnvironment(): Promise<void> {
		const { EnvConfig } = await import('./src/config/env.config')
		const validation = EnvConfig.validateConfig()
		
		if (!validation.isValid) {
			console.log(chalk.yellow('\n⚠️  Environment Configuration Issues:\n'))
			for (const error of validation.errors) {
				console.log(chalk.red(`   • ${error}`))
			}
			
			if (!EnvConfig.hasSessionId()) {
				console.log(chalk.blue('\n💡 To set up your session ID in .env:'))
				console.log('   1. Copy .env.example to .env')
				console.log('   2. Edit .env and add your TikTok session ID')
				console.log('   3. Restart the application\n')
			}
		} else if (EnvConfig.hasSessionId()) {
			console.log(chalk.green('✅ Environment configuration loaded successfully\n'))
		}
	}

	/**
	 * Setup process exit handlers
	 */
	private setupExitHandlers(): void {
		process.on('exit', (code: number): void => {
			switch (code) {
				case ExitCode.Success:
					break
				case ExitCode.TooLong:
					console.log(chalk.red('Input lines are too long!'))
					break
				case ExitCode.ProjectExists:
					console.log(chalk.red('Project already exists!'))
					break
				case ExitCode.InvalidInput:
					console.log(chalk.red('Invalid input provided!'))
					break
				case ExitCode.NetworkError:
					console.log(chalk.red('Network error occurred!'))
					break
				default:
					console.log(chalk.red(`Application exited with code: ${code}`))
			}
		})

		// Handle graceful shutdown
		process.on('SIGINT', () => {
			console.log(
				chalk.yellow(
					'\n\n⚠️  Received interrupt signal. Shutting down gracefully...',
				),
			)
			this.shutdown()
		})

		process.on('SIGTERM', () => {
			console.log(
				chalk.yellow(
					'\n\n⚠️  Received termination signal. Shutting down gracefully...',
				),
			)
			this.shutdown()
		})
	}

	/**
	 * Main application loop
	 */
	async run(): Promise<void> {
		while (this.isRunning) {
			try {
				const action = await InputHandlers.getMainMenuAction()

				switch (action) {
					case 'tts':
						await TTSController.process()
						break
					case 'info':
						this.showInfoGenerator()
						break
					case 'exit':
						this.isRunning = false
						break
				}

				if (this.isRunning) {
					const shouldContinue = await InputHandlers.askToContinue()
					if (!shouldContinue) {
						this.isRunning = false
					} else {
						clear()
						await BannerUI.show()
					}
				}
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : 'Unknown error occurred'
				BannerUI.showError('Application Error', errorMessage)

				const shouldContinue = await InputHandlers.getConfirmation(
					'Would you like to continue despite the error?',
					true,
				)

				if (!shouldContinue) {
					this.isRunning = false
				} else {
					clear()
					await BannerUI.show()
				}
			}
		}
	}

	/**
	 * Show info generator placeholder
	 */
	private showInfoGenerator(): void {
		console.log(
			chalk.hex('#754824').bold('\n🚧 Info Generator - Work in Progress\n'),
		)
		console.log(
			chalk.gray('This feature will be available in a future update.\n'),
		)
	}

	/**
	 * Graceful shutdown
	 */
	private shutdown(): void {
		this.isRunning = false
		console.log(chalk.green('\n👋 Thanks for using TTS Generator! Goodbye!\n'))
		process.exit(ExitCode.Success)
	}
}

/**
 * Application entry point
 */
async function main(): Promise<void> {
	const app = new TTSGeneratorApp()

	try {
		await app.initialize()
		await app.run()

		console.log(chalk.green('\n👋 Thanks for using TTS Generator! Goodbye!\n'))
		await Bun.sleep(1500)
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : 'Fatal error occurred'
		console.error(chalk.red(`\n💥 Fatal Error: ${errorMessage}\n`))
		process.exit(ExitCode.NetworkError)
	}
}

// Start the application
main()
	.then(() => {
		clear()
		process.exit(ExitCode.Success)
	})
	.catch((error) => {
		console.error(chalk.red(`\n💥 Unhandled Error: ${error}\n`))
		process.exit(ExitCode.NetworkError)
	})
