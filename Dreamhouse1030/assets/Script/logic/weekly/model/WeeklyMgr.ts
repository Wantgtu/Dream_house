import { BaseModel, ModelManager, ItemState } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import WeeklyItemModel from "./WeeklyItemModel";
import User from "../../user/User";
import TestConfig from "../../../config/TestConfig";
/**
* %SheetName%
**/
export default class WeeklyMgr extends BaseModel {

	protected weeklyItemModelMgr: ModelManager<WeeklyItemModel> = new ModelManager()


	initData() {
		this.weeklyItemModelMgr.initWithData(ModuleManager.dataManager.get(WeeklyItemModel.CLASS_NAME), WeeklyItemModel)

	}

	getWeeklyItemModel(id) { return this.weeklyItemModelMgr.getByID(id) }

	getWeeklyItemModelList() { return this.weeklyItemModelMgr.getList() }


	getLoginDayNum() {
		if (TestConfig.WEEKLY) {
			return 8;
		}
		return User.instance().getLoginDayNum();
	}

	hasReward() {
		// let flag = User.instance().isNewDay();
		// console.log(' hasReward flag ', flag)
		// if (!flag) {
		// 	return false;
		// }
		let dayNum = this.getLoginDayNum();
		// console.log('dayNum ', dayNum, ' this.weeklyItemModelMgr.size() ', this.weeklyItemModelMgr.size())
		if (dayNum > this.weeklyItemModelMgr.size()) {

			return false;
		}
		let curDay = this.getCurDay();
		if (!curDay) {
			return false;
		}
		if (curDay.getState() == ItemState.GOT) {
			return false;
		}
		return true;
	}

	getCurDay() {
		let dayIndex = this.getLoginDayNum() - 1;
		let list = this.getWeeklyItemModelList()
		// console.log(' dayIndex ', dayIndex, ' list.length ', list.length)
		if (dayIndex >= 0 && dayIndex < list.length) {
			return list[dayIndex]
		}
		return null;
	}

}