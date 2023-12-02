import { DataModel } from "../../../cfw/cfw";


export enum UITextModelEnum{
	text,// 文本
	
}

/**
* UI文本
**/
export default class UITextModel extends DataModel {

	static CLASS_NAME:string = 'UITextModel'
	constructor() {
		super(UITextModel.CLASS_NAME)
	}
	// 文本
	getText() {
		return this.getValue(UITextModelEnum.text)
	}
	


}