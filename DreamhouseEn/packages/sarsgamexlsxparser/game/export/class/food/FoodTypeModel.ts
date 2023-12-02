import { DataModel } from "../../../cfw/cfw";


export enum FoodTypeModelEnum{
	name,// 名称
	type,// 英文
	weight,// 权重
	state,// 状态
	costEnergy,// 是否消耗能量
	beBornInitID,// 被产出初始ID
	
}

/**
* 食物类型
**/
export default class FoodTypeModel extends DataModel {

	static CLASS_NAME:string = 'FoodTypeModel'
	constructor() {
		super(FoodTypeModel.CLASS_NAME)
	}
	// 名称
	getName() {
		return this.getValue(FoodTypeModelEnum.name)
	}
	// 英文
	getType() {
		return this.getValue(FoodTypeModelEnum.type)
	}
	// 权重
	getWeight() {
		return this.getValue(FoodTypeModelEnum.weight)
	}
	// 状态
	getState() {
		return this.getValue(FoodTypeModelEnum.state)
	}
	// 是否消耗能量
	getCostEnergy() {
		return this.getValue(FoodTypeModelEnum.costEnergy)
	}
	// 被产出初始ID
	getBeBornInitID() {
		return this.getValue(FoodTypeModelEnum.beBornInitID)
	}
	


}