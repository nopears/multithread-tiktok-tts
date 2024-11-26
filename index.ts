import clear from 'clear'
import { ExitCode } from './types'
import chalk from 'chalk'
import { TTS, showMenu, showBanner, askQuestion } from './utils'

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
	}
})

const main = async (): Promise<void> => {
	clear()
	showBanner()
	let continueExecution = true

	while (continueExecution) {
		await showMenu()
		const choice = Number(askQuestion('Enter your choice: '))
		if (choice === 1) {
			console.log(chalk.green('TTS selected'))
			await TTS()
		} else if (choice === 2) {
			console.log(chalk.hex('#754824').bold('WIP'))
		} else {
			console.log(chalk.red('Invalid choice, please try again.'))
		}
		const continueChoice = askQuestion('Do you want to continue? y/n: ')
		if (continueChoice.toLowerCase() !== 'y') {
			continueExecution = false
		}
		clear()
	}

	console.log(chalk.green('Bye!'))
	await Bun.sleep(1000)
}

main().then(() => {
	clear()
	process.exit(ExitCode.Success)
})
