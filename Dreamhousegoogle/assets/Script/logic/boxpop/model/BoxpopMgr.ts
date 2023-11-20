import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import BoxPopItemModel from "./BoxPopItemModel";
import Utils from "../../../cfw/tools/Utils";
import { LocalValue } from "../../../cfw/local";
import User from "../../user/User";
import RedTipMgr from "../../../extention/redtip/RedTipMgr";
import { RANDOM_BOX_OPEN_LEVEL, RedTipType } from "../../../config/Config";
import TestConfig from "../../../config/TestConfig";
import LevelMgr from "../../level/model/LevelMgr";
/**
* %SheetName%
**/
export default class BoxpopMgr extends BaseModel {

	protected boxPopItemModelMgr: ModelManager<BoxPopItemModel> = new ModelManager()

	protected dayNum: LocalValue
	protected count: LocalValue;
	// protected temp: BoxPopItemModel[]
	initData() {
		this.boxPopItemModelMgr.initWithData(ModuleManager.dataManager.get(BoxPopItemModel.CLASS_NAME), BoxPopItemModel)
		this.count = new LocalValue('BoxpopMgrcount', 0)
		this.dayNum = new LocalValue('BoxpopMgrdayNum', 0)

		if (this.dayNum.getInt() != User.instance().getLoginDayNum()) {
			this.count.setValue(0)
			this.dayNum.setValue(User.instance().getLoginDayNum())
		}

		if (!this.needAd() && this.isOpen()) {
			RedTipMgr.instance().addRedTip(RedTipType.BOX_POP)
		}

		if (TestConfig.BOX_POP) {
			// let list = this.getBoxPopItemModelList();
			// for (let index = 0; index < list.length; index++) {
			// 	const element = list[index];
			// 	let data = element.getItemAndWeight();
			// 	let count = data.length % 3;
			// 	console.log('BoxpopMgr data.length ', data.length, count)
			// 	if (count != 0) {
			// 		cc.error(' count is error ', index)
			// 	}
			// }
		}
	}
	needAd() {
		return this.count.getInt() >= 2;
	}
	updateCount() {
		this.count.updateValue(1)
	}
	getBoxPopItemModel(id) { return this.boxPopItemModelMgr.getByID(id) }

	getBoxPopItemModelList() { return this.boxPopItemModelMgr.getList() }

	setRandomList() {
		let array = this.getBoxPopItemModelList();
		for (let index = 0; index < array.length; index++) {
			const element = array[index];
			element.reset();
		}
		let spe = Utils.random(0, array.length)
		console.log(' spe ========= ', spe)
		if (array[spe]) {
			console.log(' spe ========= 222', spe)
			array[spe].setSpecial(1)
		}
		// let temp = []
		// let list = this.boxPopItemModelMgr.copy()
		// for (let index = 0; index < 9; index++) {
		// 	let r = Utils.random(0, list.length)
		// 	temp.push(list[r])
		// 	list.splice(r, 1)
		// }
		// this.temp = temp;
	}
	getRandomList() {

		return this.getBoxPopItemModelList();
	}

	isOpen() {
		return LevelMgr.instance().getLevel() >= RANDOM_BOX_OPEN_LEVEL
	}

	getTip() {
		return RANDOM_BOX_OPEN_LEVEL + '级之后开启';
	}
}