import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import LuckySpinItemModel from "./LuckySpinItemModel";
import { LocalValue } from "../../../cfw/local";
import User from "../../user/User";
import Utils from "../../../cfw/tools/Utils";
import RedTipMgr from "../../../extention/redtip/RedTipMgr";
import { LUCKY_SPIN_OPEN_LEVEL, RedTipType } from "../../../config/Config";
import TestConfig from "../../../config/TestConfig";
import Debug from "../../../cfw/tools/Debug";
import LevelMgr from "../../level/model/LevelMgr";
/**
* %SheetName%
**/
export default class LuckyspinMgr extends BaseModel {
	static NOTIFY_RESULT: string = 'LuckyspinMgr_NotifyResult'
	protected luckySpinItemModelMgr: ModelManager<LuckySpinItemModel> = new ModelManager()


	protected dayNum: LocalValue
	protected count: LocalValue;
	initData() {
		this.count = new LocalValue('LuckyspinMgrcount', 0)
		this.dayNum = new LocalValue('LuckyspinMgrdayNum', 0)

		if (this.dayNum.getInt() != User.instance().getLoginDayNum()) {
			this.count.setValue(0)
			this.dayNum.setValue(User.instance().getLoginDayNum())
		}
		this.luckySpinItemModelMgr.initWithData(ModuleManager.dataManager.get(LuckySpinItemModel.CLASS_NAME), LuckySpinItemModel)

		if (!this.needAd() && this.isOpen()) {
			RedTipMgr.instance().addRedTip(RedTipType.LUCKY_SPIN)
		}

		if (TestConfig.LUCK_SPIN) {
			let list = this.getLuckySpinItemModelList();
			for (let index = 0; index < list.length; index++) {
				const element = list[index];
				let data = element.getReward();

				let count = data.length % 2;
				console.log('LuckyspinMgr data.length ', data.length, count)
				if (count != 0) {
					cc.error(' count is error ', index)
				}
			}
		}
	}

    isOpen() {
        return LevelMgr.instance().getLevel() >= LUCKY_SPIN_OPEN_LEVEL
    }

	getTip(){
		return LUCKY_SPIN_OPEN_LEVEL + '级之后开启';
	}
	reset() {
		let list = this.getLuckySpinItemModelList();
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			element.clear();
		}
	}

	getLuckySpinItemModel(id) { return this.luckySpinItemModelMgr.getByID(id) }

	getLuckySpinItemModelList() { return this.luckySpinItemModelMgr.getList() }


	needAd() {
		return this.count.getInt() >= 2;
	}

	updateCount() {
		this.count.updateValue(1)
	}

	getCount() {
		return this.count.getInt();
	}

	getBitResult() {
		Debug.log('this.getCount()  ', this.getCount())
		let list = this.getLuckySpinItemModelList();
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			if (element.getCount() > 0 && this.getCount() == element.getCount()) {
				return element;
			}
		}
		return null;
	}

	getResult() {
		let result = this.getBitResult();
		if (result) {
			return result;
		}
		let r = 0;
		let list = this.getLuckySpinItemModelList();
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			r += element.getWeight();
			let random = Utils.random(0, 100)
			if (random <= r) {
				Debug.log(' getReuslt index ', index)
				return element
			}
		}
		return null;
	}

	getNextModel() {
		let count = this.getCount();
		let list = this.getLuckySpinItemModelList();
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			let c = element.getCount();
			if (c > 0 && count < c) {
				return element;
			}
		}
		return null;
	}


}