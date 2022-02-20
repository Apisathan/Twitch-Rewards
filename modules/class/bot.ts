import fs from "fs";
import {StaticAuthProvider} from "@twurple/auth";
import {PubSubClient, PubSubRedemptionMessage} from "@twurple/pubsub";
import robotjs from "robotjs";
import prompts from "prompts";

export default class Bot {

	public static async start() {
		if(fs.existsSync('config.json')){
			const config = JSON.parse(fs.readFileSync('config.json').toString());

			try {
				const authProvider = new StaticAuthProvider(config.clientId, config.accessToken);
				const pubSubClient = new PubSubClient();

				const userId = await pubSubClient.registerUserListener(authProvider);
				await pubSubClient.onRedemption(userId, (message: PubSubRedemptionMessage) => {
					if(message.rewardTitle == 'Tryk på G for mig') {
						let now = new Date();
						let time = now.getHours() + ':' +now.getMinutes()+':'+now.getSeconds();
						console.log('['+time+'] '+message.userDisplayName+' har lige redeemed Tryk på G for mig');
						robotjs.keyTap('g');
					}
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