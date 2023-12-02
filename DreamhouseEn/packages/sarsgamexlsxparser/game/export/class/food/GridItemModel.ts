import { DataModel } from "../../../cfw/cfw";


export enum GridItemModelEnum{
	state,// 状态
	foodID,// 放置食物
	outCount,// 产出个数
	time,// cd时间
	
}

/**
* 格子表
**/
export default class GridItemModel extends DataModel {

	static CLASS_NAME:string = 'GridItemModel'
	constructor() {
		super(GridItemModel.CLASS_NAME)
	}
	// 状态
	getState() {
		return this.getValue(GridItemModelEnum.state)
	}
	setState(v:any) {
		this.setValue(GridItemModelEnum.state,v)
	}
	// 放置食物
	getFoodID() {
		return this.getValue(GridItemModelEnum.foodID)
	}
	setFoodID(v:any) {
		this.setValue(GridItemModelEnum.foodID,v)
	}
	// 产出个数
	getOutCount() {
		return this.getValue(GridItemModelEnum.outCount)
	}
	setOutCount(v:any) {
		this.setValue(GridItemModelEnum.outCount,v)
	}
	// cd时间
	getTime() {
		return this.getValue(GridItemModelEnum.time)
	}
	setTime(v:any) {
		this.setValue(GridItemModelEnum.time,v)
	}
	


}