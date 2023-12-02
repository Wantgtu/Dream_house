import { DataModel } from "../../../cfw/cfw";


export enum TaskItemModelEnum{
	gold,// 需要金额
	other,// 其他道具
	level,// 等级
	state,// 状态
	buildID,// 建筑id
	decorateID,// 装饰ID
	
}

/**
* 任务表
**/
export default class TaskItemModel extends DataModel {

	static CLASS_NAME:string = 'TaskItemModel'
	constructor() {
		super(TaskItemModel.CLASS_NAME)
	}
	// 需要金额
	getGold() {
		return this.getValue(TaskItemModelEnum.gold)
	}
	// 其他道具
	getOther() {
		return this.getValue(TaskItemModelEnum.other)
	}
	// 等级
	getLevel() {
		return this.getValue(TaskItemModelEnum.level)
	}
	// 状态
	getState() {
		return this.getValue(TaskItemModelEnum.state)
	}
	setState(v:any) {
		this.setValue(TaskItemModelEnum.state,v)
	}
	// 建筑id
	getBuildID() {
		return this.getValue(TaskItemModelEnum.buildID)
	}
	// 装饰ID
	getDecorateID() {
		return this.getValue(TaskItemModelEnum.decorateID)
	}
	


}