import { DataModel } from "../../../cfw/cfw";


export enum SpecialTaskItemModelEnum{
	gold,// 所需金币
	itemList,// 奖励道具列表
	state,// 状态
	icon,// 图标
	
}

/**
* 特殊任务
**/
export default class SpecialTaskItemModel extends DataModel {

	static CLASS_NAME:string = 'SpecialTaskItemModel'
	constructor() {
		super(SpecialTaskItemModel.CLASS_NAME)
	}
	// 所需金币
	getGold() {
		return this.getValue(SpecialTaskItemModelEnum.gold)
	}
	// 奖励道具列表
	getItemList() {
		return this.getValue(SpecialTaskItemModelEnum.itemList)
	}
	// 状态
	getState() {
		return this.getValue(SpecialTaskItemModelEnum.state)
	}
	setState(v:any) {
		this.setValue(SpecialTaskItemModelEnum.state,v)
	}
	// 图标
	getIcon() {
		return this.getValue(SpecialTaskItemModelEnum.icon)
	}
	


}