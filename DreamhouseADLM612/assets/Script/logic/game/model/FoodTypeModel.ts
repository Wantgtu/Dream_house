import { DataModel } from "../../../cfw/cfw";


export enum FoodTypeModelEnum {
	name,// 名称
	type,// 开启等级
	weight,//
	state,// 状态
	costEnergy,
	beBornInitID

}

/**
* 食物类型
**/
export default class FoodTypeModel extends DataModel {

	static CLASS_NAME: string = 'FoodTypeModel'
	constructor() {
		super(FoodTypeModel.CLASS_NAME)
	}
	// 名称
	getName() {
		return this.getValue(FoodTypeModelEnum.name)
	}

	getWeight() {
		return this.getValue(FoodTypeModelEnum.weight)
	}

	// 状态
	getState() {
		return this.getValue(FoodTypeModelEnum.state)
	}

	setState(s: number) {
		this.setValue(FoodTypeModelEnum.state, s)
	}

	isCostEnergy() {
		return this.getValue(FoodTypeModelEnum.costEnergy) == 1;
	}


	getBeBornInitID() {
		return this.getValue(FoodTypeModelEnum.beBornInitID)
	}

}