import prompts from 'prompts';
import BotClass from './modules/class/bot.class';
import RewardsClass from './modules/class/rewards.class';

(async () => {
	await launch();
})();

export async function launch() {
	const response = await prompts([
		{
			type: 'select',
			name: 'option',
			message: 'Select option',
			choices: [
				{
					title: 'Start bot',
					description: 'Starts the bot',
					value: 'start'
				},
				{
					title: 'Change rewards',
					description: 'Create new or delete a current reward',
					value: 'add'
				},
				{
					title: 'Exit',
					value: 'exit'
				},
			],
		},
	]);

	switch (response.option) {
		case 'add':
			RewardsClass.start().then();
			break;
		case 'exit':
			break;
		default:
			BotClass.start().then();
			break;
	}
}