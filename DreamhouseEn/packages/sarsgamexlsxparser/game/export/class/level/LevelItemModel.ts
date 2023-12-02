import { DataModel } from "../../../cfw/cfw";


export enum LevelItemModelEnum{
	items,// 奖励
	count,// 客人数量
	state,// 状态
	
}

/**
* 等级表
**/
export default class LevelItemModel extends DataModel {

	static CLASS_NAME:string = 'LevelItemModel'
	constructor() {
		super(LevelItemModel.CLASS_NAME)
	}
	// 奖励
	getItems() {
		return this.getValue(LevelItemModelEnum.items)
	}
	// 客人数量
	getCount() {
		return this.getValue(LevelItemModelEnum.count)
	}
	// 状态
	getState() {
		return this.getValue(LevelItemModelEnum.state)
	}
	setState(v:any) {
		this.setValue(LevelItemModelEnum.state,v)
	}
	


}