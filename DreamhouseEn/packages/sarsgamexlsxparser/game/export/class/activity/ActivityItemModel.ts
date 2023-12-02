import { DataModel } from "../../../cfw/cfw";


export enum ActivityItemModelEnum{
	name,// 名称
	duration,// 领取间隔时间分钟
	perTokenNum,// 每分钟钻石奖励金额
	perGoldNum,// 每分钟体力奖励数量
	time,// 时间
	perExpNum,// 每分钟经验
	state,// 状态
	max,// 最大值
	
}

/**
* 活动
**/
export default class ActivityItemModel extends DataModel {

	static CLASS_NAME:string = 'ActivityItemModel'
	constructor() {
		super(ActivityItemModel.CLASS_NAME)
	}
	// 名称
	getName() {
		return this.getValue(ActivityItemModelEnum.name)
	}
	// 领取间隔时间分钟
	getDuration() {
		return this.getValue(ActivityItemModelEnum.duration)
	}
	// 每分钟钻石奖励金额
	getPerTokenNum() {
		return this.getValue(ActivityItemModelEnum.perTokenNum)
	}
	// 每分钟体力奖励数量
	getPerGoldNum() {
		return this.getValue(ActivityItemModelEnum.perGoldNum)
	}
	// 时间
	getTime() {
		return this.getValue(ActivityItemModelEnum.time)
	}
	setTime(v:any) {
		this.setValue(ActivityItemModelEnum.time,v)
	}
	// 每分钟经验
	getPerExpNum() {
		return this.getValue(ActivityItemModelEnum.perExpNum)
	}
	// 状态
	getState() {
		return this.getValue(ActivityItemModelEnum.state)
	}
	setState(v:any) {
		this.setValue(ActivityItemModelEnum.state,v)
	}
	// 最大值
	getMax() {
		return this.getValue(ActivityItemModelEnum.max)
	}
	


}