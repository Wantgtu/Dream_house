import { DataModel } from "../../../cfw/cfw";


export enum RandomWeightModelEnum{
	weight,// 权重
	
}

/**
* 随机物品档次
**/
export default class RandomWeightModel extends DataModel {

	static CLASS_NAME:string = 'RandomWeightModel'
	constructor() {
		super(RandomWeightModel.CLASS_NAME)
	}
	// 权重
	getWeight() {
		return this.getValue(RandomWeightModelEnum.weight)
	}
	


}