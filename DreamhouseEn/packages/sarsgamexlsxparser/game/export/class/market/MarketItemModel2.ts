import { DataModel } from "../../../cfw/cfw";


export enum MarketItemModel2Enum{
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
* 市场2
**/
export default class MarketItemModel2 extends DataModel {

	static CLASS_NAME:string = 'MarketItemModel2'
	constructor() {
		super(MarketItemModel2.CLASS_NAME)
	}
	// 类别
	getType() {
		return this.getValue(MarketItemModel2Enum.type)
	}
	// 名称
	getName() {
		return this.getValue(MarketItemModel2Enum.name)
	}
	// 索引位置
	getIndex() {
		return this.getValue(MarketItemModel2Enum.index)
	}
	// 道具列表
	getList() {
		return this.getValue(MarketItemModel2Enum.list)
	}
	// 消耗道具ID
	getCostID() {
		return this.getValue(MarketItemModel2Enum.costID)
	}
	// 消耗道具数量
	getCostNum() {
		return this.getValue(MarketItemModel2Enum.costNum)
	}
	setCostNum(v:any) {
		this.setValue(MarketItemModel2Enum.costNum,v)
	}
	// 数量
	getCount() {
		return this.getValue(MarketItemModel2Enum.count)
	}
	setCount(v:any) {
		this.setValue(MarketItemModel2Enum.count,v)
	}
	// 图标
	getIcon() {
		return this.getValue(MarketItemModel2Enum.icon)
	}
	


}