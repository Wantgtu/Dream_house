import { DataModel } from "../../../cfw/cfw";


export enum FoodRareItemModelEnum{
	eggWeight,// 砸蛋权重
	
}

/**
* 道具稀有度
**/
export default class FoodRareItemModel extends DataModel {

	static CLASS_NAME:string = 'FoodRareItemModel'
	constructor() {
		super(FoodRareItemModel.CLASS_NAME)
	}
	// 砸蛋权重
	getEggWeight() {
		return this.getValue(FoodRareItemModelEnum.eggWeight)
	}
	


}