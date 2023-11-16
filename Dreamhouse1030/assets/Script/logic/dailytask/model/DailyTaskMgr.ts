import { BaseModel, ModelManager, ItemState } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import DailyTaskItemModel, { DailyTaskItemModelEnum } from "./DailyTaskItemModel";
import { LocalValue } from "../../../cfw/local";
import User from "../../user/User";
import { RedTipType } from "../../../config/Config";
import TipC from "../../public/tip/TipC";
import UIText from "../../../cocos/lang/UIText";
import RedTipMgr from "../../../extention/redtip/RedTipMgr";
import CMgr from "../../../sdk/channel-ts/CMgr";

/**
* %SheetName%
**/

let ORDER: number[] = [1, 0, 2]
export default class DailyTaskMgr extends BaseModel {

	protected taskItemModelMgr: ModelManager<DailyTaskItemModel> = new ModelManager()

	protected loginDayNum: LocalValue;
	initData() {
		this.loginDayNum = new LocalValue('TaskMgrloginDayNum', 0)
		this.taskItemModelMgr.initWithData(ModuleManager.dataManager.get(DailyTaskItemModel.CLASS_NAME), DailyTaskItemModel)
		let day = User.instance().getLoginDayNum();
		// day = 4;
		let list = this.taskItemModelMgr.getList();
		if (this.loginDayNum.getInt() != day) {
			// console.log('this.loginDayNum.getInt()  ', this.loginDayNum.getInt(), 'day ', day)
			this.loginDayNum.setValue(day)


			// console.log(' list.length ', list.length)
			for (let index = 0; index < list.length; index++) {
				const element = list[index];
				element.setState(ItemState.NOT_GET, false)
				// console.log(' element.getCfgCount()1111 ', element.getCurCount())
				element.setCurCount(0, false)
				// console.log(' element.getCfgCount()22222 ', element.getCurCount())
				if (index == list.length - 1) {
					element.saveValue(DailyTaskItemModelEnum.state)
				}
			}
		} else {
			for (let index = 0; index < list.length; index++) {
				const element = list[index];
				if (element.getState() == ItemState.CAN_GET) {
					RedTipMgr.instance().addRedTip(RedTipType.DAILY_TASK, element.getID())
				}
			}
		}
	}

	getTaskItemModel(id) { return this.taskItemModelMgr.getByID(id) }

	getTaskItemModelList() {
		this.taskItemModelMgr.sortitemList((a: DailyTaskItemModel, b: DailyTaskItemModel) => {
			return ORDER[b.getState()] - ORDER[a.getState()];
		})
		let list = []
		let temp = this.taskItemModelMgr.getList();
		for (let index = 0; index < temp.length; index++) {
			const element = temp[index];
			if (element.getID() == 9) {
				// console.log('CMgr.helper.marketHasType(2)', CMgr.helper.marketHasType(2))
				if (CMgr.helper.marketHasType(2)) {
					list.push(element)
				}
			} else {
				list.push(element)
			}

		}
		return list
	}

	checkState() {
		let list = this.taskItemModelMgr.getList();
		for (let index = 0; index < list.length; index++) {
			const m = list[index];
			if (m.getCurCount() >= m.getCount()) {
				// m.setCount(0)

				if (m.getState() == ItemState.NOT_GET) {
					m.setState(ItemState.CAN_GET, false)
					TipC.instance().showToast(UIText.instance().getText('39', { name: m.getName() }))
				}
				// if (m.getState() == ItemState.CAN_GET) {
				// RedTipManager.instance().addRedTip(8, m.getID())
				// }
			}

			if (index == list.length - 1) {
				m.saveValue(DailyTaskItemModelEnum.state)
			}

		}
	}



	updateTaskCount(id: number, num: number = 1) {
		if (!CMgr.helper.hasDailyTask()) {
			return;
		}
		let m: DailyTaskItemModel = this.getTaskItemModel(id)
		if (m) {
			let c = m.getCount()
			if (c > 0) {
				if (m.getState() == ItemState.NOT_GET) {
					m.setCurCount(m.getCurCount() + num)
					if (m.getCurCount() >= m.getCount()) {
						// m.setCount(0)

						m.setState(ItemState.CAN_GET)
						RedTipMgr.instance().addRedTip(RedTipType.DAILY_TASK, m.getID())



					}
				}

			}

		}
	}


}