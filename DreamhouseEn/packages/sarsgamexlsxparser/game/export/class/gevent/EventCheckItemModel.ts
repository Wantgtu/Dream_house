import { DataModel } from "../../../cfw/cfw";


export enum EventCheckItemModelEnum{
	type,// 触发条件类型
	conditionList,// 附加条件列表
	state,// 状态
	
}

/**
* 事件表
**/
export default class EventCheckItemModel extends DataModel {

	static CLASS_NAME:string = 'EventCheckItemModel'
	constructor() {
		super(EventCheckItemModel.CLASS_NAME)
	}
	// 触发条件类型
	getType() {
		return this.getValue(EventCheckItemModelEnum.type)
	}
	// 附加条件列表
	getConditionList() {
		return this.getValue(EventCheckItemModelEnum.conditionList)
	}
	// 状态
	getState() {
		return this.getValue(EventCheckItemModelEnum.state)
	}
	setState(v:any) {
		this.setValue(EventCheckItemModelEnum.state,v)
	}
	


}