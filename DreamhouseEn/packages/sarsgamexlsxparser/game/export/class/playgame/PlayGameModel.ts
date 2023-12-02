import { DataModel } from "../../../cfw/cfw";


export enum PlayGameModelEnum{
	name,// 名称
	icon,// 图标
	moduleID,// 模块
	
}

/**
* 游戏列表
**/
export default class PlayGameModel extends DataModel {

	static CLASS_NAME:string = 'PlayGameModel'
	constructor() {
		super(PlayGameModel.CLASS_NAME)
	}
	// 名称
	getName() {
		return this.getValue(PlayGameModelEnum.name)
	}
	// 图标
	getIcon() {
		return this.getValue(PlayGameModelEnum.icon)
	}
	// 模块
	getModuleID() {
		return this.getValue(PlayGameModelEnum.moduleID)
	}
	


}