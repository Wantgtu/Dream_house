import { DataModel } from "../../../cfw/cfw";
import FoodItemModel from "../../game/model/FoodItemModel";
import BagManager from "../../public/bag/BagManager";
import PersonMgr from "../../person/model/PersonMgr";
import { BaseItemModel, ItemState } from "../../../cfw/model";
import FoodMgr from "../../game/model/FoodMgr";
import BuyMgr from "./BuyMgr";
import { GEvent } from "../../../cfw/event";
import { EventName } from "../../../config/Config";


export enum BuyItemModelEnum {
	personID,// 顾客id
	items,// 要买的道具
	itemID,// 道具类型
	itemNum,// 金额
	state,
	delete,

}

/**
* 顾客表
**/
export default class BuyItemModel extends DataModel {

	static CLASS_NAME: string = 'BuyItemModel'
	constructor() {
		super(BuyItemModel.CLASS_NAME)
	}
	protected items: FoodItemModel[] = []
	protected rewardItem: BaseItemModel;
	// 顾客id
	getPersonID() {
		return this.getValue(BuyItemModelEnum.personID)
	}
	// 要买的道具
	getItems() {
		return this.getValue(BuyItemModelEnum.items)
	}
	// 道具类型
	getItemID() {
		return this.getValue(BuyItemModelEnum.itemID)
	}
	// 金额
	getItemNum() {
		return this.getValue(BuyItemModelEnum.itemNum)
	}

	setPersonID(id: number) {
		this.setValue(BuyItemModelEnum.personID, id)
	}

	getDelete() {
		return this.getValue(BuyItemModelEnum.delete)
	}

	getItemList() {
		if (this.items.length == 0) {
			let list = this.getItems()
			for (let index = 0; index < list.length; index++) {
				const element = list[index];
				let item: any = BagManager.instance().getNewItemModel(element, 1)
				this.items.push(item)
			}

		}
		return this.items;
	}


	getPerson() {
		return PersonMgr.instance().getPersonItemModel(this.getPersonID())
	}

	getRewardItem() {
		let id = this.getItemID();
		let num = this.getItemNum();
		if (!this.rewardItem) {
			this.rewardItem = BagManager.instance().getNewItemModel(id, num)
		}
		return this.rewardItem;

	}



	removeSelf() {

	}

	getState() {
		return this.getValue(BuyItemModelEnum.state)
	}

	setState(s: number) {
		this.setValue(BuyItemModelEnum.state, s)
		if (s == ItemState.CAN_GET) {
			// console.log(' BUY_ITEM_FULL ')
			GEvent.instance().emit(EventName.BUY_ITEM_FULL, this.getID())
		}
	}

}