import { DataModel } from "../../../cfw/cfw";


export enum RedTipStepModelEnum{
	tipID,// 提示ID
	uiGroupID,// ui组
	
}

/**
* 红点步骤
**/
export default class RedTipStepModel extends DataModel {

	static CLASS_NAME:string = 'RedTipStepModel'
	constructor() {
		super(RedTipStepModel.CLASS_NAME)
	}
	// 提示ID
	getTipID() {
		return this.getValue(RedTipStepModelEnum.tipID)
	}
	setTipID(v:any) {
		this.setValue(RedTipStepModelEnum.tipID,v)
	}
	// ui组
	getUiGroupID() {
		return this.getValue(RedTipStepModelEnum.uiGroupID)
	}
	


}