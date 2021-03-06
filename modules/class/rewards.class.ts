import fs from "fs";
import prompts, {Choice} from "prompts";
import {launch} from "../../app";
import {RewardInterface} from "../interfaces/reward.interface";
import cliColor from "cli-color";

export default class RewardsClass {

	/**
	 * Show menu
	 */
	public static async start() {
		const response = await prompts([
			{
				type: 'select',
				name: 'option',
				message: 'Select option',
				choices: [
					{
						title: 'Show',
						value: 'show'
					},
					{
						title: 'Add',
						value: 'add'
					},
					{
						title: 'Remove',
						value: 'remove'
					},
					{
						title: 'Back',
						description: 'Go back to the main menu',
						value: 'back'
					},
				],
			},
		]);

		switch (response.option) {
			case 'add':
				await this.add();
				break;
			case 'remove':
				await this.remove();
				break;
			case 'back':
				await launch();
				break;
			default:
				await this.show();
				break;
		}
	}

	/**
	 * Get all rewards
	 */
	public static get()  {
		if(fs.existsSync('rewards.json')){
			return <RewardInterface[]> JSON.parse(fs.readFileSync('rewards.json').toString());
		}
		return [];
	}

	/**
	 * Show all rewards
	 */
	public static async show() {
		const rewards = this.get();
		if (rewards.length == 0) {
			console.log(cliColor.red('No rewards is made'));
		} else {
			console.log(cliColor.green('--- REWARDS ---'));
			console.log('');
			rewards.forEach(function (reward, index) {
				console.log(' - '+cliColor.yellow(reward.name)+` [Presses: ${reward.key}]`);
			});
			console.log('');
			console.log(cliColor.green('--- REWARDS ---'));
		}
		await this.back();
	}

	/**
	 * Add reward
	 *
	 * @private
	 */
	private static async add() {
		const response = await prompts([
			{
				type: 'text',
				name: 'name',
				message: 'Whats the reward name? (Needs to be the same as on Twitch)',
				validate: function (value) {
					return value.length > 0;
				}
			},
			{
				type: 'text',
				name: 'key',
				message: 'What key should be pressed when redeemed?',
				validate: function (value) {
					return value.length === 1;
				}
			},
		]);

		this.create({
			key: response.key,
			name: response.name
		})
		await this.start();
	}

	/**
	 * Create a reward
	 *
	 * @param reward
	 */
	public static create(reward: RewardInterface) {
		let rewards = this.get();
		if(rewards.filter(fReward => fReward.name == reward.name).length) {
			console.error(cliColor.red(`Theres already a reward called: ${reward.name}`));
			return false;
		}

		rewards.push({
			'key': reward.key,
			'name': reward.name,
		});

		fs.writeFileSync('rewards.json', JSON.stringify(rewards));
		console.log(cliColor.greenBright(`Created ${reward.name} which presses on: ${reward.key}`));
		return true;
	}

	/**
	 * Select a reward to remove.
	 *
	 * @private
	 */
	private static async remove() {
		let rewards = this.get();

		if(rewards.length === 0) {
			console.log(`${cliColor.red('No rewards is made')}`)
			await this.start();
			return;
		}

		let choices: Choice[] = [];
		rewards.forEach(function (reward, index) {
			choices.push({
				title: reward.name,
				value: index,
			})
		});
		choices.push({
			title: '- Go back',
			value: 'back'
		})

		const response = await prompts([
			{
				type: 'select',
				name: 'option',
				message: 'What reward do you want to delete?',
				choices: choices
			},
		]);

		if(response.option !== 'back') {
			let reward = rewards[response.option];
			const confirmResponse = await prompts([
				{
					type: 'toggle',
					name: 'value',
					message: `Are you sure you want to delete: ${reward.name}?`,
					active: 'yes',
					inactive: 'no'
				},
			]);

			if(confirmResponse.value) {
				rewards.splice(response.option, 1);
				fs.writeFileSync('rewards.json', JSON.stringify(rewards));
				console.log(cliColor.redBright(`Deleted: ${reward.name}`));
			}
		}
		await this.start();
	}

	/**
	 * Show back confirm
	 *
	 * @private
	 */
	private static async back() {
		const response = await prompts([
			{
				type: 'toggle',
				name: 'value',
				message: 'Do you wanna to go back to rewards menu?',
				active: 'yes',
				inactive: 'no',
				initial: true,
			},
		]);

		if(response.value) {
			await this.start();
		}
	}

}