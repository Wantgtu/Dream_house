import { DataModel } from "../../../cfw/cfw";


export enum ItemModelEnum{
	name,// 名称
	effect,// 作用
	icon,// 图标
	count,// 数量
	tip,// 提示
	sound,// 声音
	scale,// 缩放比例
	
}

/**
* 消费道具
**/
export default class ItemModel extends DataModel {

	static CLASS_NAME:string = 'ItemModel'
	constructor() {
		super(ItemModel.CLASS_NAME)
	}
	// 名称
	getName() {
		return this.getValue(ItemModelEnum.name)
	}
	// 作用
	getEffect() {
		return this.getValue(ItemModelEnum.effect)
	}
	// 图标
	getIcon() {
		return this.getValue(ItemModelEnum.icon)
	}
	// 数量
	getCount() {
		return this.getValue(ItemModelEnum.count)
	}
	setCount(v:any) {
		this.setValue(ItemModelEnum.count,v)
	}
	// 提示
	getTip() {
		return this.getValue(ItemModelEnum.tip)
	}
	// 声音
	getSound() {
		return this.getValue(ItemModelEnum.sound)
	}
	// 缩放比例
	getScale() {
		return this.getValue(ItemModelEnum.scale)
	}
	


}