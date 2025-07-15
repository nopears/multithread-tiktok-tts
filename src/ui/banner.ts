/**
 * Banner UI Component
 * Handles the application banner and welcome screen
 */

import boxen from 'boxen'
import chalk from 'chalk'
import figlet from 'figlet'
import gradient from 'gradient-string'
import { AppConfig } from '../config/app.config'

export class BannerUI {
	/**
	 * Display the application banner
	 */
	static async show(): Promise<void> {
		const banner = figlet.textSync('TTS Generator', {
			font: AppConfig.ui.banner.font,
			horizontalLayout: 'default',
			verticalLayout: 'default',
		})

		const gradientBanner = gradient(['cyan', 'magenta'])(banner)

		console.log(
			boxen(
				gradientBanner +
					'\n\n' +
					chalk.white('🎵 Convert text to speech with ease\n') +
					chalk.gray('Made with ❤️  by @nopears'),
				{
					title: 'Welcome',
					titleAlignment: 'center',
					padding: 2,
					margin: 1,
					borderStyle: 'double',
					borderColor: 'cyan',
				},
			),
		)
	}

	/**
	 * Display a section header
	 */
	static showSectionHeader(title: string, description: string): void {
		console.log(
			boxen(chalk.cyan(`${title}\n\n${description}`), {
				title: title,
				titleAlignment: 'center',
				padding: 1,
				margin: 1,
				borderStyle: 'double',
				borderColor: 'cyan',
			}),
		)
	}

	/**
	 * Display success message
	 */
	static showSuccess(title: string, content: string): void {
		console.log(
			boxen(chalk.green(`✅ ${title}\n\n`) + chalk.white(content), {
				title: 'Success',
				titleAlignment: 'center',
				padding: 1,
				margin: 1,
				borderStyle: 'round',
				borderColor: 'green',
			}),
		)
	}

	/**
	 * Display error message
	 */
	static showError(title: string, error: string): void {
		console.log(
			boxen(chalk.red(`❌ ${title}\n\n`) + chalk.white(`Error: ${error}`), {
				title: 'Error',
				titleAlignment: 'center',
				padding: 1,
				margin: 1,
				borderStyle: 'round',
				borderColor: 'red',
			}),
		)
	}

	/**
	 * Display warning message
	 */
	static showWarning(message: string): void {
		console.log(chalk.yellow(`\n⚠️  ${message}\n`))
	}
}
