import { DataModel } from "../../../cfw/cfw";
import { BaseItemModel, ItemState } from "../../../cfw/model";
import BagManager from "../../public/bag/BagManager";
import LangManager from "../../../cfw/tools/LangManager";


export enum DailyTaskItemModelEnum {
	name,
	desc,// 任务描述
	count,// 目标数量
	state,// 状态
	exp,
	reward,
	curCount,
}

/**
* 每日任务
**/
export default class DailyTaskItemModel extends DataModel {

	static CLASS_NAME: string = 'DailyTaskItemModel'
	constructor() {
		super(DailyTaskItemModel.CLASS_NAME)
	}

	protected item: BaseItemModel;
	// 任务描述
	getDesc() {
		// return this.getValue(DailyTaskItemModelEnum.desc)
		let langID = this.getValue(DailyTaskItemModelEnum.desc)
		return LangManager.instance().getLocalString(langID)
	}
	// 目标数量
	getCount() {
		return this.getValue(DailyTaskItemModelEnum.count)
	}

	getName() {
		let langID = this.getValue(DailyTaskItemModelEnum.name)
		return LangManager.instance().getLocalString(langID)
	}


	getCurCount() {
		return this.getValue(DailyTaskItemModelEnum.curCount)
	}

	setCurCount(n: number, isSave: boolean = true) {
		this.setValue(DailyTaskItemModelEnum.curCount, n)
	}


	// 状态
	getState() {
		return this.getValue(DailyTaskItemModelEnum.state)
	}

	setState(s: number, isSave: boolean = true) {
		this.setValue(DailyTaskItemModelEnum.state, s)
	}

	getExp() {
		return this.getValue(DailyTaskItemModelEnum.exp)
	}

	getReward() {
		return this.getValue(DailyTaskItemModelEnum.reward)
	}

	getItem() {
		if (!this.item) {
			let list = this.getReward();
			this.item = BagManager.instance().getNewItemModel(list[0], list[1])
		}
		return this.item;
	}
}