import { DataModel } from "../../../cfw/cfw";


export enum DialogItemModelEnum{
	dialogID,// 对话ID
	dir,// 所在方向
	person,// 人物ID
	emoji,// 表情
	content,// 对话内容
	
}

/**
* 对话表
**/
export default class DialogItemModel extends DataModel {

	static CLASS_NAME:string = 'DialogItemModel'
	constructor() {
		super(DialogItemModel.CLASS_NAME)
	}
	// 对话ID
	getDialogID() {
		return this.getValue(DialogItemModelEnum.dialogID)
	}
	// 所在方向
	getDir() {
		return this.getValue(DialogItemModelEnum.dir)
	}
	// 人物ID
	getPerson() {
		return this.getValue(DialogItemModelEnum.person)
	}
	// 表情
	getEmoji() {
		return this.getValue(DialogItemModelEnum.emoji)
	}
	// 对话内容
	getContent() {
		return this.getValue(DialogItemModelEnum.content)
	}
	


}