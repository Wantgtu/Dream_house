import { DataModel } from "../../../cfw/cfw";


export enum GuideFuncModelEnum{
	funcName,// 函数名称
	param,// 参数
	compName,// 组件名称
	
}

/**
* 函数表
**/
export default class GuideFuncModel extends DataModel {

	static CLASS_NAME:string = 'GuideFuncModel'
	constructor() {
		super(GuideFuncModel.CLASS_NAME)
	}
	// 函数名称
	getFuncName() {
		return this.getValue(GuideFuncModelEnum.funcName)
	}
	// 参数
	getParam() {
		return this.getValue(GuideFuncModelEnum.param)
	}
	// 组件名称
	getCompName() {
		return this.getValue(GuideFuncModelEnum.compName)
	}
	


}