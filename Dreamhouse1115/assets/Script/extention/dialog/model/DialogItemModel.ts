import { DataModel } from "../../../cfw/cfw";
import PersonMgr from "../../../logic/person/model/PersonMgr";
import LangManager from "../../../cfw/tools/LangManager";


export enum DialogItemModelEnum {
	dialogID,// 对话ID
	dir,// 所在方向
	person,// 人物ID
	emoji,
	content,// 对话内容

}

/**
* 对话表
**/
export default class DialogItemModel extends DataModel {

	static CLASS_NAME: string = 'DialogItemModel'
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
		let pid = this.getValue(DialogItemModelEnum.person)
		return PersonMgr.instance().getPersonItemModel(pid)
	}
	// 对话内容
	getContent() {
		return this.getValue(DialogItemModelEnum.content)
		// let langID = this.getValue(DialogItemModelEnum.content)
		// return LangManager.instance().getLocalString(langID)
	}

	getEmoji() {
		return this.getValue(DialogItemModelEnum.emoji)
	}




}