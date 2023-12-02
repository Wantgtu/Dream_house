import { DataModel } from "../../../cfw/cfw";


export enum DailyTaskItemModelEnum{
	name,// 名称
	desc,// 任务描述
	count,// 目标数量
	state,// 状态
	exp,// 经验奖励
	reward,// 奖励道具
	curCount,// curCount
	
}

/**
* 每日任务
**/
export default class DailyTaskItemModel extends DataModel {

	static CLASS_NAME:string = 'DailyTaskItemModel'
	constructor() {
		super(DailyTaskItemModel.CLASS_NAME)
	}
	// 名称
	getName() {
		return this.getValue(DailyTaskItemModelEnum.name)
	}
	// 任务描述
	getDesc() {
		return this.getValue(DailyTaskItemModelEnum.desc)
	}
	// 目标数量
	getCount() {
		return this.getValue(DailyTaskItemModelEnum.count)
	}
	// 状态
	getState() {
		return this.getValue(DailyTaskItemModelEnum.state)
	}
	setState(v:any) {
		this.setValue(DailyTaskItemModelEnum.state,v)
	}
	// 经验奖励
	getExp() {
		return this.getValue(DailyTaskItemModelEnum.exp)
	}
	// 奖励道具
	getReward() {
		return this.getValue(DailyTaskItemModelEnum.reward)
	}
	// curCount
	getCurCount() {
		return this.getValue(DailyTaskItemModelEnum.curCount)
	}
	setCurCount(v:any) {
		this.setValue(DailyTaskItemModelEnum.curCount,v)
	}
	


}