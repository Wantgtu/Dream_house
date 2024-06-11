import { DataModel } from "../../../cfw/cfw";
import { LocalValue, LocalList } from "../../../cfw/local";
import { EventName } from "../../../config/Config";
import { TimeHelper } from "../../../cfw/time";
import MarketMgr from "./MarketMgr";
import FoodMgr from "../../game/model/FoodMgr";
import FoodItemModel from "../../game/model/FoodItemModel";
import Utils from "../../../cfw/tools/Utils";
import LangManager from "../../../cfw/tools/LangManager";


export enum MarketTypeModelEnum {
	name,// 名称
	refreshTime,// 刷新时长分钟
	cost,// 刷新花费
	state,// 状态
	prefab,

}

/**
* 市场内容类型
**/
export default class MarketTypeModel extends DataModel {

	static CLASS_NAME: string = 'MarketTypeModel'
	constructor() {
		super(MarketTypeModel.CLASS_NAME)
	}

	protected time: LocalValue;
	protected foodIDList: LocalList;
	init(id, data) {
		super.init(id, data)
		// console.log(' this.getCost()  ', this.getCost())
		if (this.getCost() > 0) {
			this.foodIDList = new LocalList('MarketMgr_FoodIDList' + this.ID, 0)
			if (!this.foodIDList.isHaveData()) {
				this.setFoodList()
			}
		}
		let time = this.getRefreshTime()
		if (time > 0) {
			this.time = new LocalValue('MarketTypeModel' + this.ID, 0)
			if (TimeHelper.leftTime(this.time.getInt()) <= 0) {
				this.resetTime();
			}
		}

	}
	setFoodList() {

		let list = FoodMgr.instance().getRandomFoodID();
		// console.log(' count ', list.length)
		for (let index = 0; index < 6; index++) {
			let r = Utils.random(0, list.length)
			// console.log('r ', r)
			let item: FoodItemModel = list[r]
			// console.log('item ', item)
			this.foodIDList.set(index, item.getID())
			list.splice(r, 1)
		}
		let temp = MarketMgr.instance().getMarketList(this.getID())
		for (let index = 0; index < temp.length; index++) {
			const element = temp[index];
			element.clearItem();
		}
		this.emit(EventName.UPDATE_FOOD_LIST)
	}

	hasFood(foodID: number) {
		let list = MarketMgr.instance().getMarketList(this.getID())
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			if (element.getCount() > 0) {
				let itemList = element.getItemList()
				for (let k = 0; k < itemList.length; k++) {
					const food = itemList[k];
					if (foodID == food.getID()) {
						return true;
					}
				}
			}
		}

		// for (let index = 0; index < this.foodIDList.size(); index++) {
		// 	const element = this.foodIDList.getInt(index)
		// 	if (foodID == element) {
		// 		return true;
		// 	}
		// }
		return false
	}

	getFoodID(index: number) {
		if (this.foodIDList)
			return this.foodIDList.get(index)

		return 0;
	}
	resetTime() {
		let time = this.getRefreshTime()
		let v = time * 60 * 1000;
		// console.log('resetTime', v)
		this.time.setValue(Date.now() + v)
		if (this.foodIDList) {

			this.setFoodList()
		}

		this.resetCount();
	}

	resetCount() {
		let list = MarketMgr.instance().getMarketList(this.getID())
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			element.resetCount();
		}
	}

	getMarketItems() {
		return MarketMgr.instance().getMarketList(this.getID())
	}

	getTime() {
		return this.time.getInt();
	}
	// 名称
	getName() {
		let langID = this.getValue(MarketTypeModelEnum.name)
		return LangManager.instance().getLocalString(langID)
	}
	// 刷新时长分钟
	getRefreshTime() {
		return this.getValue(MarketTypeModelEnum.refreshTime)
	}
	setRefreshTime(v: any) {
		this.setValue(MarketTypeModelEnum.refreshTime, v)
	}
	// 刷新花费
	getCost() {
		return this.getValue(MarketTypeModelEnum.cost)
	}
	// 状态
	getState() {
		return this.getValue(MarketTypeModelEnum.state)
	}
	setState(v: any) {
		this.setValue(MarketTypeModelEnum.state, v)
	}

	getPrefab() {
		return this.getValue(MarketTypeModelEnum.prefab)
	}


}