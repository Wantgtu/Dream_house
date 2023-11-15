import { DataModel } from "../../../cfw/cfw";



export enum EventItemModelEnum {
	eventID,// 事件ID
	save,// 是否存档
	operateType,// 操作类型
	param,// 事件参数
	// isNext,// 是否进入下一步

}

/**
* 事件步骤
**/
export default class EventItemModel extends DataModel {

	static CLASS_NAME: string = 'EventItemModel'
	constructor() {
		super(EventItemModel.CLASS_NAME)
	}
	// 事件ID
	getEventID() {
		return this.getValue(EventItemModelEnum.eventID)
	}
	// 是否存档
	getSave() {
		return this.getValue(EventItemModelEnum.save)
	}
	// 操作类型
	getOperateType() {
		return this.getValue(EventItemModelEnum.operateType)
	}
	// 事件参数
	getParam() {
		return this.getValue(EventItemModelEnum.param)
	}
	// 是否进入下一步
	// getIsNext() {
	// 	return this.getValue(EventItemModelEnum.isNext)
	// }


}