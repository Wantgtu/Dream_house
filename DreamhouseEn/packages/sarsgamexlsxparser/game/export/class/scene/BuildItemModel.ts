import { DataModel } from "../../../cfw/cfw";


export enum BuildItemModelEnum{
	type,// 场景id
	index,// 顺序
	item,// 使用道具索引
	state,// 状态
	coin,// 金额
	
}

/**
* 建筑表
**/
export default class BuildItemModel extends DataModel {

	static CLASS_NAME:string = 'BuildItemModel'
	constructor() {
		super(BuildItemModel.CLASS_NAME)
	}
	// 场景id
	getType() {
		return this.getValue(BuildItemModelEnum.type)
	}
	// 顺序
	getIndex() {
		return this.getValue(BuildItemModelEnum.index)
	}
	// 使用道具索引
	getItem() {
		return this.getValue(BuildItemModelEnum.item)
	}
	setItem(v:any) {
		this.setValue(BuildItemModelEnum.item,v)
	}
	// 状态
	getState() {
		return this.getValue(BuildItemModelEnum.state)
	}
	setState(v:any) {
		this.setValue(BuildItemModelEnum.state,v)
	}
	// 金额
	getCoin() {
		return this.getValue(BuildItemModelEnum.coin)
	}
	setCoin(v:any) {
		this.setValue(BuildItemModelEnum.coin,v)
	}
	


}