import fs from "fs";
import prompts from "prompts";
import {launch} from "../../app";

export default class Rewards {

	public static async start() {
		const response = await prompts([
			{
				type: 'select',
				name: 'option',
				message: 'Select option',
				choices: [
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
		}
	}

	public static get(){
		if(fs.existsSync('config.json')){
			return JSON.parse(fs.readFileSync('config.json').toString());
		}
		return false;
	}

	private static async add() {
		const response = await prompts([
			{
				type: 'text',
				name: 'name',
				message: 'Whats the reward name?',
			},
			{
				type: 'text',
				name: 'key',
				message: 'What key should be pressed when redeemed?',
			},
		]);
		console.log(response);
	}

	private static async remove() {
		let config = this.get();
		console.log(config);
	}

}