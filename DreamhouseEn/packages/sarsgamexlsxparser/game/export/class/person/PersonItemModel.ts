import { DataModel } from "../../../cfw/cfw";


export enum PersonItemModelEnum{
	name,// 名字
	icon,// 图标
	emoji,// 表情
	
}

/**
* 人物表
**/
export default class PersonItemModel extends DataModel {

	static CLASS_NAME:string = 'PersonItemModel'
	constructor() {
		super(PersonItemModel.CLASS_NAME)
	}
	// 名字
	getName() {
		return this.getValue(PersonItemModelEnum.name)
	}
	// 图标
	getIcon() {
		return this.getValue(PersonItemModelEnum.icon)
	}
	// 表情
	getEmoji() {
		return this.getValue(PersonItemModelEnum.emoji)
	}
	


}