import { DataModel } from "../../../cfw/cfw";
import ItemModel from "../../item/model/ItemModel";
import { BaseItemModel } from "../../../cfw/model";
import BagManager from "../../public/bag/BagManager";
import Utils from "../../../cfw/tools/Utils";
import FoodMgr from "../../game/model/FoodMgr";


export enum LuckySpinItemModelEnum {
	reward,// 奖励道具
	weight,// 权重
	count,

}

/**
* 辛运转盘
**/
export default class LuckySpinItemModel extends DataModel {

	static CLASS_NAME: string = 'LuckySpinItemModel'
	constructor() {
		super(LuckySpinItemModel.CLASS_NAME)
	}

	protected item: BaseItemModel;
	// 奖励道具
	getReward() {
		return this.getValue(LuckySpinItemModelEnum.reward)
	}
	// 权重
	getWeight() {
		return this.getValue(LuckySpinItemModelEnum.weight)
	}

	clear() {
		this.item = null;
	}


	getItem() {
		if (!this.item) {
			let list: number[] = this.getReward();
			this.item = FoodMgr.instance().getItemByRareList(list)
			// let count = list.length / 2
			// let index = Utils.random(0, count)
			// let id = list[index * 2]
			// let num = list[index * 2 + 1]
			// this.item = BagManager.instance().getNewItemModel(id, num)
		}
		return this.item;
	}

	getCount() {
		return this.getValue(LuckySpinItemModelEnum.count)
	}


}