import { DataModel } from "../../../cfw/cfw";
import SpecialtaskMgr from "./SpecialtaskMgr";
import { BaseItemModel } from "../../../cfw/model";


export enum SpecialTaskItemModelEnum {
	gold,// 所需金币
	itemList,// 奖励道具列表
	state,// 状态
	icon,

}

/**
* 特殊任务
**/
export default class SpecialTaskItemModel extends DataModel {

	static CLASS_NAME: string = 'SpecialTaskItemModel'
	constructor() {
		super(SpecialTaskItemModel.CLASS_NAME)
	}
	// 所需金币
	getGold() {
		return this.getValue(SpecialTaskItemModelEnum.gold)// / 10
	}
	// 奖励道具列表
	getItemList() {
		return this.getValue(SpecialTaskItemModelEnum.itemList)
	}
	// 状态
	getState() {
		return this.getValue(SpecialTaskItemModelEnum.state)
	}
	setState(v: any, save: boolean = true) {
		this.setValue(SpecialTaskItemModelEnum.state, v, save)
		this.emit(BaseItemModel.UPDATE_STATE)
	}


	getIcon() {
		return 'specialtask/bg/special'// + this.getValue(SpecialTaskItemModelEnum.icon)
	}

	getSpriteFrame() {
		return this.getValue(SpecialTaskItemModelEnum.icon)
	}

	isLastTask() {
		return this.getID() == SpecialtaskMgr.instance().getSize();
	}


}