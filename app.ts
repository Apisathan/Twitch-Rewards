import prompts from 'prompts';
import Bot from './modules/class/bot';
import Rewards from './modules/class/rewards';

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
			],
		},
	]);

	switch (response.option) {
		case 'add':
			Rewards.start().then();
			break;
		default:
			Bot.start().then();
			break;
	}
}