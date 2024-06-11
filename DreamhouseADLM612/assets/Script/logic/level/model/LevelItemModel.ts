import { DataModel } from "../../../cfw/cfw";
import { BaseItemModel } from "../../../cfw/model";
import BagManager from "../../public/bag/BagManager";
import { ModuleID } from "../../../config/ModuleConfig";
import TaskMgr from "../../task/model/TaskMgr";
import { EXP_NUM } from "../../../config/Config";


export enum LevelItemModelEnum {
	items,// 奖励
	count,// 客人数量
	state,// 特殊订单

}

/**
* 等级表
**/
export default class LevelItemModel extends DataModel {

	static CLASS_NAME: string = 'LevelItemModel'
	constructor() {
		super(LevelItemModel.CLASS_NAME)
	}
	protected itemList: BaseItemModel[] = []
	// 经验要求
	getExp() {
		// return this.getValue(LevelItemModelEnum.exp)
		let list = TaskMgr.instance().getTaskIndexData(this.getID())
		return list.length * EXP_NUM
	}
	// 奖励
	getItems() {
		return this.getValue(LevelItemModelEnum.items)
	}
	// 客人数量
	getCount() {
		return this.getValue(LevelItemModelEnum.count)
	}

	getState() {
		return this.getValue(LevelItemModelEnum.state)
	}

	setState(s: number) {
		this.setValue(LevelItemModelEnum.state, s)
	}

	getItemList() {
		let list: number[] = this.getItems();
		if (list && list.length) {
			if (this.itemList.length == 0) {
				let count = list.length / 2
				for (let index = 0; index < count; index++) {
					const id = list[index * 2];
					let num = list[index * 2 + 1]
					this.itemList.push(BagManager.instance().getNewItemModel(id, num))
				}
			}
		}
		return this.itemList;
	}

	getModuleID() {
		return ModuleID.PUBLIC;
	}

}