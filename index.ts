import clear from "clear";
import { ExitCode } from "./types";
import chalk from "chalk";
import { TTS, showMenu, showBanner, askQuestion, rl } from './utils'

process.on("exit", (code: number): void => {
	switch (code) {
		case ExitCode.Success:
			break;
		case ExitCode.TooLong:
			console.log(chalk.red('Input lines are too long!'));
			break;
		case ExitCode.ProjectExists:
			console.log(chalk.red('Project already exists!'));
			break;
	}
});

const main = async (): Promise<void> => {
	showBanner();
	while (true) {
		await showMenu();
		const choice = Number(await askQuestion('Enter your choice: '));
		if (choice === 1) {
			console.log(chalk.green('TTS selected'));
			await TTS()
		} else if (choice === 2) {
			console.log(chalk.hex("#754824").bold("WIP"))
		} else {
			console.log(chalk.red('Invalid choice, please try again.'));
		}
		const continueChoice = await askQuestion('Do you want to continue? y/n: ');
		if (continueChoice.toLowerCase() !== 'y') {
			break;
		}
	}
	rl.close();
	console.log(chalk.green('Bye!'));
};

await main();
await Bun.sleep(1000);
clear();
process.exit(0)

