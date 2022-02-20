import fs from "fs";
import {StaticAuthProvider} from "@twurple/auth";
import {PubSubClient, PubSubRedemptionMessage} from "@twurple/pubsub";
import robotjs from "robotjs";
import prompts from "prompts";
import RewardsClass from './rewards.class';
import {RewardInterface} from "../interfaces/reward.interface";
import cliColor from "cli-color";

export default class BotClass {

	private static rewards: RewardInterface[];

	/**
	 * Launches the listener
	 */
	public static async start() {
		this.rewards = RewardsClass.get();
		if(fs.existsSync('config.json')){
			const config = JSON.parse(fs.readFileSync('config.json').toString());

			try {
				const authProvider = new StaticAuthProvider(config.clientId, config.accessToken);
				const pubSubClient = new PubSubClient();

				const userId = await pubSubClient.registerUserListener(authProvider);
				await pubSubClient.onRedemption(userId, (message: PubSubRedemptionMessage) => {
					this.rewards.forEach(function (reward) {
						if(message.rewardTitle == reward.name) {
							let now = new Date();
							let time = now.getHours() + ':' +now.getMinutes()+':'+now.getSeconds();
							console.log(`[${time}] ${message.userDisplayName} just redeemed: ${cliColor.blueBright(reward.name)}`)
							robotjs.keyTap(reward.key);
						}
					});
				});
				console.log('The bot is ready!');
			}catch (e) {
				fs.unlinkSync('config.json');
				console.log('Client id or accessToken is wrong try again!');
				await this.start();
			}
		}else{
			console.log('Get your clientId / accessToken here: https://twitchtokengenerator.com/quick/VdYdZJwddE');

			const response = await prompts([
				{
					type: 'text',
					name: 'clientId',
					message: 'Insert client id'
				},
				{
					type: 'text',
					name: 'accessToken',
					message: 'Insert access token'
				}
			]);

			let config = {
				"clientId": response.clientId,
				"accessToken": response.accessToken
			}
			fs.writeFileSync('config.json', JSON.stringify(config));
			await this.start();
		}
	}

}