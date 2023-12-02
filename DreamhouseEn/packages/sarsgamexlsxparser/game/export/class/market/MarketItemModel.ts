import { DataModel } from "../../../cfw/cfw";


export enum MarketItemModelEnum{
	type,// 类别
	name,// 名称
	index,// 索引位置
	list,// 道具列表
	costID,// 消耗道具ID
	costNum,// 消耗道具数量
	count,// 数量
	icon,// 图标
	
}

/**
* 市场
**/
export default class MarketItemModel extends DataModel {

	static CLASS_NAME:string = 'MarketItemModel'
	constructor() {
		super(MarketItemModel.CLASS_NAME)
	}
	// 类别
	getType() {
		return this.getValue(MarketItemModelEnum.type)
	}
	// 名称
	getName() {
		return this.getValue(MarketItemModelEnum.name)
	}
	// 索引位置
	getIndex() {
		return this.getValue(MarketItemModelEnum.index)
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
		return this.getValue(MarketItemModelEnum.costNum)
	}
	setCostNum(v:any) {
		this.setValue(MarketItemModelEnum.costNum,v)
	}
	// 数量
	getCount() {
		return this.getValue(MarketItemModelEnum.count)
	}
	setCount(v:any) {
		this.setValue(MarketItemModelEnum.count,v)
	}
	// 图标
	getIcon() {
		return this.getValue(MarketItemModelEnum.icon)
	}
	


}