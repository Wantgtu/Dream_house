import { DataModel } from "../../../cfw/cfw";
import MarketMgr from "./MarketMgr";
import { ModuleID } from "../../../config/ModuleConfig";
import { BaseItemModel } from "../../../cfw/model";
import BagManager from "../../public/bag/BagManager";
import { EventName, RedTipType } from "../../../config/Config";
import FoodItemModel from "../../game/model/FoodItemModel";
import LangManager from "../../../cfw/tools/LangManager";
import FoodMediator from "../../public/mediator/FoodMediator";
import RedTipMgr from "../../../extention/redtip/RedTipMgr";

export enum MarketItemModelEnum {
	type,// 类别
	name,// 名称
	index,
	list,// 道具列表
	costID,// 消耗道具ID
	costNum,// 消耗道具数量
	count,// 数量
	icon,// 图标

}
export default class BaseMarketItemModel extends DataModel {

    protected itemList: BaseItemModel[] = []
	protected costItem: BaseItemModel;

	init(id, data) {
		super.init(id)
		if (!this.costItem && this.getCostID() > 0) {

			this.costItem = BagManager.instance().getNewItemModel(this.getCostID(), this.getCostNum())
		}

		if (!this.getCostItem()) {
			if (this.getCount() > 0) {
				RedTipMgr.instance().addRedTip(RedTipType.STORE, 30232)
			}

		}
	}
	// 类别
	getType() {
		return this.getValue(MarketItemModelEnum.type)
	}
	// 名称
	getName() {
		let langID = this.getValue(MarketItemModelEnum.name)
		return LangManager.instance().getLocalString(langID)
	}
	// 道具列表
	getList() {
		return this.getValue(MarketItemModelEnum.list)
	}
	// 消耗道具ID
	getCostID() {
		return this.getValue(MarketItemModelEnum.costID)
	}
	// 消耗道具数量
	getCostNum() {
		let num = this.getValue(MarketItemModelEnum.costNum)
		return num;
	}

	getNum() {
		let costNum = this.costItem.getNum(false)
		if (costNum == 0) {
			let food = this.itemList[0] as FoodItemModel;
			if (food)
				costNum = food.getMarketPrice();
		}
		return costNum;
	}

	getCostItem() {
		let id = this.getCostID()
		if (!id) {
			return null;
		}

		return this.costItem;
	}

	clearItem() {
		FoodMediator.instance().removeMarketFoods(this.itemList)
		this.itemList.length = 0
		this.emit(EventName.UPDATE_FOOD)
	}

	resetCount() {
		this.setCount(this.getCfgValue(MarketItemModelEnum.count))
		if (!this.getCostItem()) {
			RedTipMgr.instance().addRedTip(RedTipType.STORE, 30232)
		}
	}

	resetCostNum() {
		this.setCostNum(this.getCfgValue(MarketItemModelEnum.costNum))
	}
	setCostNum(v: any) {
		this.setValue(MarketItemModelEnum.costNum, v)
		this.emit(EventName.CHANGE_COST_COUNT)
	}
	// 数量
	getCount() {
		return this.getValue(MarketItemModelEnum.count)
	}
	setCount(v: any) {
		this.setValue(MarketItemModelEnum.count, v)
		this.emit(EventName.CHANGE_COUNT)
		if (v == 0) {
			FoodMediator.instance().removeMarketFoods(this.itemList)
			if (!this.getCostItem()) {
				RedTipMgr.instance().removeRedTip(RedTipType.STORE)
			}
		}
	}

	getIndex() {
		return this.getValue(MarketItemModelEnum.index)
	}
	// 图标
	getIcon() {
		return 'market/texture/market'
	}

	getSpriteFrame() {
		let icon = this.getValue(MarketItemModelEnum.icon)
		if (icon) {
			return icon;
		}
		return ''
	}


	getTypeModel() {
		let type = this.getType();
		return MarketMgr.instance().getMarketTypeModel(type)
	}

	getModuleID() {
		return ModuleID.PUBLIC
	}

	getItemList() {
		if (this.itemList.length == 0) {
			let list = this.getList();
			let count = list.length / 2;
			for (let index = 0; index < count; index++) {
				let itemID = list[index * 2];
				let itemNum = list[index * 2 + 1]
				if (itemID != -1) {
					let item = BagManager.instance().getNewItemModel(itemID, itemNum)
					this.itemList.push(item)
				} else {
					let typeModel = MarketMgr.instance().getMarketTypeModel(this.getType())
					itemID = typeModel.getFoodID(this.getIndex())
					// console.log('getItemList itemID 222', itemID)
					if (itemID) {
						let item = BagManager.instance().getNewItemModel(itemID, itemNum)
						this.itemList.push(item)
					}
				}
			}
			FoodMediator.instance().addMarketFoods(this.itemList)
		}
		return this.itemList;
	}
}
