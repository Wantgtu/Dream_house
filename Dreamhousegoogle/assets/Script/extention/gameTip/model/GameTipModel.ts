import { DataModel } from "../../../cfw/cfw";
import LangManager from "../../../cfw/tools/LangManager";


export enum GameTipModelEnum {
	content,// 提示内容
	isSkip,// 是否直接跳过
	x,// 屏幕x
	y,// 屏幕y

}

/**
* 提示表
**/
export default class GameTipModel extends DataModel {

	static CLASS_NAME: string = 'GameTipModel'
	constructor() {
		super(GameTipModel.CLASS_NAME)
	}
	// 提示内容
	getContent() {
		return this.getValue(GameTipModelEnum.content)
		// let langID = this.getValue(GameTipModelEnum.content)
		// return LangManager.instance().getLocalString(langID)
	}
	// 是否直接跳过
	getIsSkip() {
		return this.getValue(GameTipModelEnum.isSkip)
	}
	// 屏幕x
	getX() {
		return this.getValue(GameTipModelEnum.x)
	}
	// 屏幕y
	getY() {
		return this.getValue(GameTipModelEnum.y)
	}



}