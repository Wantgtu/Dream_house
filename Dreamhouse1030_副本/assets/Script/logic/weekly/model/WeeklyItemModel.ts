import { DataModel } from "../../../cfw/cfw";
import BagManager from "../../public/bag/BagManager";
import ItemModel from "../../item/model/ItemModel";
import User from "../../user/User";
import { EventName } from "../../../config/Config";
import { BaseItemModel } from "../../../cfw/model";
import WeeklyMgr from "./WeeklyMgr";


export enum WeeklyItemModelEnum {
	reward,// 奖励
	num,
	state,// 状态

}

/**
* 登录奖励
**/
export default class WeeklyItemModel extends DataModel {

	static CLASS_NAME: string = 'WeeklyItemModel'
	protected item: BaseItemModel;
	constructor() {
		super(WeeklyItemModel.CLASS_NAME)
	}

	getNum() {
		return this.getValue(WeeklyItemModelEnum.num)
	}
	// 奖励
	getReward() {
		return this.getValue(WeeklyItemModelEnum.reward)
	}
	// 状态
	getState() {
		return this.getValue(WeeklyItemModelEnum.state)
	}

	setState(s: number) {
		this.setValue(WeeklyItemModelEnum.state, s)
		this.emit(EventName.UPDATE_WEEKLY_STATE)
	}

	getItem() {
		if (!this.item) {
			// console.log('getItem this.getNum() ', this.getNum())
			this.item = BagManager.instance().getNewItemModel(this.getReward(), this.getNum())
		}
		return this.item
	}


	isCurDay() {
		return this.getID() == WeeklyMgr.instance().getLoginDayNum()
	}

	isPast() {
		return this.getID() < WeeklyMgr.instance().getLoginDayNum()
	}

}