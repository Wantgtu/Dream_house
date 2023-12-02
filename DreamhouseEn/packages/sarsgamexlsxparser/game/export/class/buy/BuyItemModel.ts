import { DataModel } from "../../../cfw/cfw";


export enum BuyItemModelEnum{
	personID,// 顾客id
	items,// 要买的道具
	itemID,// 道具类型
	itemNum,// 金额
	state,// 状态
	delete,// 删除道具
	
}

/**
* 顾客表
**/
export default class BuyItemModel extends DataModel {

	static CLASS_NAME:string = 'BuyItemModel'
	constructor() {
		super(BuyItemModel.CLASS_NAME)
	}
	// 顾客id
	getPersonID() {
		return this.getValue(BuyItemModelEnum.personID)
	}
	setPersonID(v:any) {
		this.setValue(BuyItemModelEnum.personID,v)
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
	// 状态
	getState() {
		return this.getValue(BuyItemModelEnum.state)
	}
	setState(v:any) {
		this.setValue(BuyItemModelEnum.state,v)
	}
	// 删除道具
	getDelete() {
		return this.getValue(BuyItemModelEnum.delete)
	}
	


}