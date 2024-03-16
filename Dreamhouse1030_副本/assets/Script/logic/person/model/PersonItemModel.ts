import { DataModel } from "../../../cfw/cfw";
import { ModuleID } from "../../../config/ModuleConfig";
import LangManager from "../../../cfw/tools/LangManager";


export enum PersonItemModelEnum {
	name,
	icon,// 图标
	emoji,
}

/**
* 人物表
**/
export default class PersonItemModel extends DataModel {

	static CLASS_NAME: string = 'PersonItemModel'
	constructor() {
		super(PersonItemModel.CLASS_NAME)
	}
	// 图标
	getIcon() {
		return 'bg/person'
	}

	getSpriteFrame() {
		return this.getValue(PersonItemModelEnum.icon)
	}

	getModuleID() {
		return ModuleID.GAME;
	}

	getName() {
		let langID = this.getValue(PersonItemModelEnum.name)
		return LangManager.instance().getLocalString(langID)
	}


	getEmoji(idx: number) {
		let list: string[] = this.getValue(PersonItemModelEnum.emoji)
		if (idx >= 0 && idx <= list.length - 1) {
			return list[idx]
		}
		return ''
	}


}