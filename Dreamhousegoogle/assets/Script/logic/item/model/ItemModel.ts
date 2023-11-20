import { DataModel } from "../../../cfw/cfw";
import { ModuleID } from "../../../config/ModuleConfig";
import LangManager from "../../../cfw/tools/LangManager";


export enum ItemModelEnum {
	name,// 名称
	effect,// 作用
	icon,// 图标
	count,// 数量
	tip,// 提示
	sound,// 声音
	scale,

}

/**
* 消费道具
**/
export default class ItemModel extends DataModel {

	static CLASS_NAME: string = 'ItemModel'
	constructor() {
		super(ItemModel.CLASS_NAME)
	}
	// 名称
	getName() {
		let langID = this.getValue(ItemModelEnum.name)
		return LangManager.instance().getLocalString(langID)
	}
	// 作用
	getEffect() {
		return this.getValue(ItemModelEnum.effect)
	}
	// 图标
	getIcon() {
		return 'public/public'
	}

	getSpriteFrame() {
		return this.getValue(ItemModelEnum.icon)
	}
	// 数量
	getNum(flag: boolean = true) {
		if (flag) {
			return this.getValue(ItemModelEnum.count)
		} else {
			return super.getNum()
		}

	}
	// 提示
	getTip() {
		return this.getValue(ItemModelEnum.tip)
	}
	// 声音
	getSound() {
		return this.getValue(ItemModelEnum.sound)
	}

	setNum(n: number, flag: boolean = true) {
		if (flag) {
			this.setValue(ItemModelEnum.count, n)
		} else {
			super.setNum(n)

		}
		return true;
	}

	getModuleID() {
		return ModuleID.PUBLIC;
	}

	getScale() {
		return this.getValue(ItemModelEnum.scale)
	}

	getLevel() {
		return 0;
	}
	isInMarket() {
		return false
	}

	getOutput() {
		return []
	}
}