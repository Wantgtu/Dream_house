import { DataModel } from "../../../cfw/cfw";


export enum LuckySpinItemModelEnum{
	reward,// 奖励道具稀有度
	weight,// 权重
	count,// 必中次数
	
}

/**
* 幸运转盘
**/
export default class LuckySpinItemModel extends DataModel {

	static CLASS_NAME:string = 'LuckySpinItemModel'
	constructor() {
		super(LuckySpinItemModel.CLASS_NAME)
	}
	// 奖励道具稀有度
	getReward() {
		return this.getValue(LuckySpinItemModelEnum.reward)
	}
	// 权重
	getWeight() {
		return this.getValue(LuckySpinItemModelEnum.weight)
	}
	// 必中次数
	getCount() {
		return this.getValue(LuckySpinItemModelEnum.count)
	}
	


}