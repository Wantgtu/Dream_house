import { DataModel } from "../../../cfw/cfw";


export enum GuideItemModelEnum{
	guideID,// 教学ID
	tipID,// 提示信息ID
	
}

/**
* 教学引导步骤
**/
export default class GuideItemModel extends DataModel {

	static CLASS_NAME:string = 'GuideItemModel'
	constructor() {
		super(GuideItemModel.CLASS_NAME)
	}
	// 教学ID
	getGuideID() {
		return this.getValue(GuideItemModelEnum.guideID)
	}
	// 提示信息ID
	getTipID() {
		return this.getValue(GuideItemModelEnum.tipID)
	}
	


}