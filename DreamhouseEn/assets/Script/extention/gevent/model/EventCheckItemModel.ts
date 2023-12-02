import { DataModel } from "../../../cfw/cfw";


export enum EventCheckItemModelEnum {
	type,// 触发条件类型
	// compareType,// 对比类型
	// data,// 当前值
	conditionList,// 附加条件列表
	state,
}

/**
* 事件表
**/
export default class EventCheckItemModel extends DataModel {

	static CLASS_NAME: string = 'EventCheckItemModel'
	constructor() {
		super(EventCheckItemModel.CLASS_NAME)
	}
	// 触发条件类型
	getType() {
		return this.getValue(EventCheckItemModelEnum.type)
	}
	// 对比类型
	// getCompareType() {
	// 	return this.getValue(EventCheckItemModelEnum.compareType)
	// }
	// // 当前值
	// getData() {
	// 	return this.getValue(EventCheckItemModelEnum.data)
	// }
	// 附加条件列表
	getConditionList() {
		return this.getValue(EventCheckItemModelEnum.conditionList)
	}

	setState(s: number) {
		this.setValue(EventCheckItemModelEnum.state, s)
	}

	getState() {
		return this.getValue(EventCheckItemModelEnum.state)
	}



}