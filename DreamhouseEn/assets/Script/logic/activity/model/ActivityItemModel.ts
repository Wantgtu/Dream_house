import { DataModel } from "../../../cfw/cfw";
import { TimeHelper } from "../../../cfw/time";
import { EventName } from "../../../config/Config";
import { LocalValue } from "../../../cfw/local";
import { ItemState } from "../../../cfw/model";
import LangManager from "../../../cfw/tools/LangManager";
import FoodItemModel from "../../game/model/FoodItemModel";
import FoodMgr from "../../game/model/FoodMgr";


export enum ActivityItemModelEnum {
	name,// 名称
	duration,// 领取间隔时间分钟
	perTokenNum,// 每分钟钻石奖励金额
	perGoldNum,// 每分钟金币奖励数量
	time,// 时间
	perExpNum,
	state,
	max,

}

/**
* 活动
**/
export default class ActivityItemModel extends DataModel {

	static CLASS_NAME: string = 'ActivityItemModel'
	protected count: LocalValue;
	// protected dayNum: LocalValue;

	protected item: FoodItemModel;
	constructor() {
		super(ActivityItemModel.CLASS_NAME)
	}

	getItem() {
		if (!this.item) {
			this.item = FoodMgr.instance().getItemByRare(0)
			this.item.setNum(this.getOnlineToken())
		}
		return this.item;

	}


	clear() {
		this.item = null;
	}

	init(id, data) {
		super.init(id, data)
		let time = this.getTime();
		if (time == 0) {
			this.reset();
		}

	}

	reset() {
		if (!this.count) {
			this.count = new LocalValue('ActivityItemModel' + this.ID, 0)
		}
		this.item = null;
		let dur = this.getDuration(this.count.getInt())
		this.setTime(Date.now() + dur * 60 * 1000)
		this.setState(ItemState.NOT_GET)
	}

	updateCount() {
		if (!this.count) {
			this.count = new LocalValue('ActivityItemModel' + this.ID, -1)
		}
		this.count.updateValue(1)
	}
	// 名称
	getName() {
		let langID = this.getValue(ActivityItemModelEnum.name)
		return LangManager.instance().getLocalString(langID)
	}
	// 领取间隔时间分钟
	getDuration(index: number) {

		let list: number[] = this.getValue(ActivityItemModelEnum.duration)

		// let index = this.count.getInt();
		if (index > list.length - 1) {
			index = list.length - 1;
			if (index < 0) {
				index = 0;
			}
		} else {

		}
		// console.log(' list ', list, 'index ', index)
		let value = list[index]
		return value;
	}

	setState(s: number) {
		this.setValue(ActivityItemModelEnum.state, s)
		// if (s == ItemState.CAN_GET) {
		// 	RedTipManager.instance().addRedTip(9)
		// } else {
		// 	RedTipManager.instance().removeRedTip(9)
		// }
	}

	getState() {
		return this.getValue(ActivityItemModelEnum.state)
	}
	// 每分钟钻石奖励金额
	private getPerTokenNum() {
		return this.getValue(ActivityItemModelEnum.perTokenNum)
	}
	// 每分钟金币奖励数量
	private getPerGoldNum() {
		return this.getValue(ActivityItemModelEnum.perGoldNum)
	}
	// 时间
	getTime() {
		return this.getValue(ActivityItemModelEnum.time)
	}

	getOnlineToken() {
		// let dur = this.getDuration(this.count.getInt())
		let num = this.getPerTokenNum();
		return num
	}

	getOnLineGold() {
		// let dur = this.getDuration(this.count.getInt())
		let num = this.getPerGoldNum();
		return num
	}

	setTime(t: number) {
		this.setValue(ActivityItemModelEnum.time, t)
		this.emit(EventName.UPDATE_ONLINE_TIME)
	}

	getPerExpNum() {
		return this.getValue(ActivityItemModelEnum.perExpNum)
	}


	getPassTime() {
		let time = Date.now() - this.getTime();
		return Math.floor(time / 1000);
	}


	getTokenNum() {
		let passTime = this.getPassTime();
		let tm = passTime / 60;
		let token = Math.ceil(tm * this.getPerTokenNum());
		let maxList = this.getMax();
		if (token > maxList[0]) {
			token = maxList[0]
		}
		return token;
	}

	getGoldNum() {
		let passTime = this.getPassTime();
		let tm = passTime / 60;
		let token = Math.ceil(tm * this.getPerGoldNum());
		let maxList = this.getMax();
		if (token > maxList[1]) {
			token = maxList[1]
		}
		return token;
	}


	getLeftTime() {
		let time = this.getTime();
		return TimeHelper.leftTime(time)
	}

	getMax() {
		return this.getValue(ActivityItemModelEnum.max)
	}

}