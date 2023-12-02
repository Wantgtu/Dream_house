import { DataModel } from "../../../cfw/cfw";


export enum WeeklyItemModelEnum{
	reward,// 奖励
	rewardNum,// 奖励数量
	state,// 状态
	
}

/**
* 登录奖励
**/
export default class WeeklyItemModel extends DataModel {

	static CLASS_NAME:string = 'WeeklyItemModel'
	constructor() {
		super(WeeklyItemModel.CLASS_NAME)
	}
	// 奖励
	getReward() {
		return this.getValue(WeeklyItemModelEnum.reward)
	}
	// 奖励数量
	getRewardNum() {
		return this.getValue(WeeklyItemModelEnum.rewardNum)
	}
	// 状态
	getState() {
		return this.getValue(WeeklyItemModelEnum.state)
	}
	setState(v:any) {
		this.setValue(WeeklyItemModelEnum.state,v)
	}
	


}