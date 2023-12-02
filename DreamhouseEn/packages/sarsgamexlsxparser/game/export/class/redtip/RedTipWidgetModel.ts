import { DataModel } from "../../../cfw/cfw";


export enum RedTipWidgetModelEnum{
	widgetName,// 名称
	className,// 界面名称
	offsetX,// x偏移
	offsetY,// y偏移
	isItem,// 是否是道具
	dir,// 红点方向
	
}

/**
* 控件组
**/
export default class RedTipWidgetModel extends DataModel {

	static CLASS_NAME:string = 'RedTipWidgetModel'
	constructor() {
		super(RedTipWidgetModel.CLASS_NAME)
	}
	// 名称
	getWidgetName() {
		return this.getValue(RedTipWidgetModelEnum.widgetName)
	}
	// 界面名称
	getClassName() {
		return this.getValue(RedTipWidgetModelEnum.className)
	}
	// x偏移
	getOffsetX() {
		return this.getValue(RedTipWidgetModelEnum.offsetX)
	}
	// y偏移
	getOffsetY() {
		return this.getValue(RedTipWidgetModelEnum.offsetY)
	}
	// 是否是道具
	getIsItem() {
		return this.getValue(RedTipWidgetModelEnum.isItem)
	}
	// 红点方向
	getDir() {
		return this.getValue(RedTipWidgetModelEnum.dir)
	}
	


}