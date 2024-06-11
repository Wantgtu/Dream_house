import { BaseModel, ModelManager, ItemState } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import LevelItemModel from "./LevelItemModel";
import { LocalValue } from "../../../cfw/local";
import { ItemID, DailyTaskID, EventName, ItemType } from "../../../config/Config";
import ItemModel from "../../item/model/ItemModel";
import BagManager from "../../public/bag/BagManager";
import DailyTaskMgr from "../../dailytask/model/DailyTaskMgr";
import CMgr from "../../../sdk/channel-ts/CMgr";
import UmengEventID from "../../../config/UmengEventID";
import { GEvent } from "../../../cfw/event";
import TestConfig from "../../../config/TestConfig";
import Debug from "../../../cfw/tools/Debug";
/**
* %SheetName%
**/
export default class LevelMgr extends BaseModel {

	protected levelItemModelMgr: ModelManager<LevelItemModel> = new ModelManager()

	protected level: LocalValue;
	initData() {
		this.level = new LocalValue('level', 1)
		this.levelItemModelMgr.initWithData(ModuleManager.dataManager.get(LevelItemModel.CLASS_NAME), LevelItemModel)

		if (TestConfig.LEVEL_TEST) {
			let list = this.getLevelItemModelList();
			for (let index = 0; index < list.length; index++) {
				const element = list[index];
				let items = element.getItemList();
				// Debug.warn('count ', items.length)
				for (let j = 0; j < items.length; j++) {
					const food = items[j];
					if (food.getType() != ItemType.FOOD) {
						Debug.warn(' ele ', element.getID())
					}
				}
			}
		}
	}

	checkLevel(m: ItemModel) {
		let lv = LevelMgr.instance().updateExp(m)
		if (lv) {
			// setTimeout(() => {
			GEvent.instance().emit(EventName.UPDATE_LEVEL)
			// this.intoLayer()
			// }, 1000);
		}
	}


	getLevelItemModel(id) { return this.levelItemModelMgr.getByID(id) }

	getLevelItemModelList() { return this.levelItemModelMgr.getList() }

	updateExp(exp: ItemModel) {
		if (!this.isMaxLevel()) {
			let num = exp.getNum();
			let nextLv = this.getNextLevel();
			let m = this.getLevelItemModel(nextLv)
			let curM = this.getCurLevel();
			if (m) {
				let need = curM.getExp();
				if (num >= need) {
					m.setState(ItemState.CAN_GET)
					BagManager.instance().updateItemNum(ItemID.EXP, -need)
					this.level.updateValue(1)
					DailyTaskMgr.instance().updateTaskCount(DailyTaskID.LEVEL)
					CMgr.helper.trackEvent(UmengEventID.level, { level: m.getID() })
					return m;
				} else {

				}
			} else {

			}

		}

		return null;
	}

	// getExp() {
	// 	return this.exp.getInt();
	// }

	getTotalExp() {
		if (this.isMaxLevel()) {
			let lv = this.getLevel() - 1;
			let m = this.getLevelItemModel(lv)
			return m.getExp();
		} else {
			// let nextLv = this.getNextLevel();
			// let m = this.getLevelItemModel(nextLv)
			// return m.getExp();
			let m = this.getCurLevel()
			return m.getExp();
		}
	}

	getNextLevel() {
		let lv = this.getLevel();
		return lv + 1;
	}

	isMaxLevel() {
		let lv = this.getNextLevel();
		let m = this.getLevelItemModel(lv)
		return m == undefined || m == null;
	}

	getLevel() {
		return this.level.getInt()
	}

	getCurLevel() {
		return this.getLevelItemModel(this.getLevel())
	}

	getPersonNum() {
		let cur = this.getLevelItemModel(this.getLevel())
		if (cur) {
			return cur.getCount();
		}
		return 1;
	}
	addItems(m: LevelItemModel, r: number = 1) {
		// console.log(' m.getState() == ItemState.CAN_GET ', m.getState() == ItemState.CAN_GET)
		if (m.getState() == ItemState.CAN_GET) {
			let list = m.getItemList()
			// console.log(' list.length ', list.length)
			if (list && list.length > 0) {
				for (let i = 0; i < r; i++) {
					for (let index = 0; index < list.length; index++) {
						const element = list[index];
						BagManager.instance().updateItem(element)
					}

				}

			}
			m.setState(ItemState.GOT)
		}

	}

	getRightModel() {
		let list = this.getLevelItemModelList();
		let level = this.getLevel();
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			if (element.getID() < level) {
				if (element.getState() == ItemState.CAN_GET) {
					return element;
				}
			} else if (element.getID() == level) {
				return element
			} else {
				return null;
			}
		}
		return null;
	}
}