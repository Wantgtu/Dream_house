import { DataModel } from "../../../cfw/cfw";


export enum RandomItemModelEnum{
	item,// 道具ID
	weight,// 权重
	special,// 是否贵重物品
	
}

/**
* 随机物品
**/
export default class RandomItemModel extends DataModel {

	static CLASS_NAME:string = 'RandomItemModel'
	constructor() {
		super(RandomItemModel.CLASS_NAME)
	}
	// 道具ID
	getItem() {
		return this.getValue(RandomItemModelEnum.item)
	}
	// 权重
	getWeight() {
		return this.getValue(RandomItemModelEnum.weight)
	}
	// 是否贵重物品
	getSpecial() {
		return this.getValue(RandomItemModelEnum.special)
	}
	


}