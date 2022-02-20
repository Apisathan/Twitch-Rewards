import RewardsClass from './modules/class/rewards.class';
import * as core from '@actions/core';

(async () => {
	if(RewardsClass.create({
		key: 'e',
		name: 'Test'
	})) {
		core.setFailed('Failed to create a reward');
	}
})();