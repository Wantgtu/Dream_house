import { DataModel } from "../../../cfw/cfw";


export enum MarketTypeModelEnum{
	name,// 名称
	refreshTime,// 刷新时长分钟
	cost,// 刷新花费
	state,// 状态
	prefab,// 预制体
	
}

/**
* 市场内容类型
**/
export default class MarketTypeModel extends DataModel {

	static CLASS_NAME:string = 'MarketTypeModel'
	constructor() {
		super(MarketTypeModel.CLASS_NAME)
	}
	// 名称
	getName() {
		return this.getValue(MarketTypeModelEnum.name)
	}
	// 刷新时长分钟
	getRefreshTime() {
		return this.getValue(MarketTypeModelEnum.refreshTime)
	}
	setRefreshTime(v:any) {
		this.setValue(MarketTypeModelEnum.refreshTime,v)
	}
	// 刷新花费
	getCost() {
		return this.getValue(MarketTypeModelEnum.cost)
	}
	// 状态
	getState() {
		return this.getValue(MarketTypeModelEnum.state)
	}
	setState(v:any) {
		this.setValue(MarketTypeModelEnum.state,v)
	}
	// 预制体
	getPrefab() {
		return this.getValue(MarketTypeModelEnum.prefab)
	}
	


}