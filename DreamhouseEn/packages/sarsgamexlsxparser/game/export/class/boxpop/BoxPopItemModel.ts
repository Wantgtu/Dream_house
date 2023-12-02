import { DataModel } from "../../../cfw/cfw";


export enum BoxPopItemModelEnum{
	state,// 状态
	
}

/**
* 神秘宝箱
**/
export default class BoxPopItemModel extends DataModel {

	static CLASS_NAME:string = 'BoxPopItemModel'
	constructor() {
		super(BoxPopItemModel.CLASS_NAME)
	}
	// 状态
	getState() {
		return this.getValue(BoxPopItemModelEnum.state)
	}
	setState(v:any) {
		this.setValue(BoxPopItemModelEnum.state,v)
	}
	


}