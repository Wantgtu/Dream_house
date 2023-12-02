import { DataModel } from "../../../cfw/cfw";


export enum FoodItemModelEnum{
	name,// 名称
	rare,// 稀有度
	ftype,// 类型
	state,// 状态
	icon,// 图标
	nextID,// 下一级
	scale,// 缩放
	price,// 随机类型
	outType,// 产出类型
	output,// 产出
	outCount,// 产出个数
	time,// cd时间
	openPrice,// 解锁价格
	splitRandom,// 分身钻石价格
	level,// 等级
	sellPrice,// 回收金币价格
	marketPrice,// 商店售卖价格
	
}

/**
* 食物表
**/
export default class FoodItemModel extends DataModel {

	static CLASS_NAME:string = 'FoodItemModel'
	constructor() {
		super(FoodItemModel.CLASS_NAME)
	}
	// 名称
	getName() {
		return this.getValue(FoodItemModelEnum.name)
	}
	// 稀有度
	getRare() {
		return this.getValue(FoodItemModelEnum.rare)
	}
	// 类型
	getFtype() {
		return this.getValue(FoodItemModelEnum.ftype)
	}
	// 状态
	getState() {
		return this.getValue(FoodItemModelEnum.state)
	}
	setState(v:any) {
		this.setValue(FoodItemModelEnum.state,v)
	}
	// 图标
	getIcon() {
		return this.getValue(FoodItemModelEnum.icon)
	}
	// 下一级
	getNextID() {
		return this.getValue(FoodItemModelEnum.nextID)
	}
	// 缩放
	getScale() {
		return this.getValue(FoodItemModelEnum.scale)
	}
	// 随机类型
	getPrice() {
		return this.getValue(FoodItemModelEnum.price)
	}
	// 产出类型
	getOutType() {
		return this.getValue(FoodItemModelEnum.outType)
	}
	// 产出
	getOutput() {
		return this.getValue(FoodItemModelEnum.output)
	}
	// 产出个数
	getOutCount() {
		return this.getValue(FoodItemModelEnum.outCount)
	}
	// cd时间
	getTime() {
		return this.getValue(FoodItemModelEnum.time)
	}
	// 解锁价格
	getOpenPrice() {
		return this.getValue(FoodItemModelEnum.openPrice)
	}
	// 分身钻石价格
	getSplitRandom() {
		return this.getValue(FoodItemModelEnum.splitRandom)
	}
	// 等级
	getLevel() {
		return this.getValue(FoodItemModelEnum.level)
	}
	// 回收金币价格
	getSellPrice() {
		return this.getValue(FoodItemModelEnum.sellPrice)
	}
	// 商店售卖价格
	getMarketPrice() {
		return this.getValue(FoodItemModelEnum.marketPrice)
	}
	


}