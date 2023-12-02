import { DataModel } from "../../../cfw/cfw";


export enum GuideNodeModelEnum{
	widgetName,// 节点名称
	className,// 界面节点名称
	is3D,// 是否是3D
	index,// 子节点的位置
	index2,// 次级子节点的位置
	
}

/**
* 节点表
**/
export default class GuideNodeModel extends DataModel {

	static CLASS_NAME:string = 'GuideNodeModel'
	constructor() {
		super(GuideNodeModel.CLASS_NAME)
	}
	// 节点名称
	getWidgetName() {
		return this.getValue(GuideNodeModelEnum.widgetName)
	}
	// 界面节点名称
	getClassName() {
		return this.getValue(GuideNodeModelEnum.className)
	}
	// 是否是3D
	getIs3D() {
		return this.getValue(GuideNodeModelEnum.is3D)
	}
	// 子节点的位置
	getIndex() {
		return this.getValue(GuideNodeModelEnum.index)
	}
	// 次级子节点的位置
	getIndex2() {
		return this.getValue(GuideNodeModelEnum.index2)
	}
	


}