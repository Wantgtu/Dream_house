import { DataModel } from "../../../cfw/cfw";
import SceneMgr from "./SceneMgr";


export enum SceneItemModelEnum{
	name,// 名称
	bundle,// 目录分包
	
}

/**
* 场景表
**/
export default class SceneItemModel extends DataModel {

	static CLASS_NAME:string = 'SceneItemModel'
	constructor() {
		super(SceneItemModel.CLASS_NAME)
	}
	// 名称
	getName() {
		return this.getValue(SceneItemModelEnum.name)
	}
	// 目录分包
	getBundle() {
		return this.getValue(SceneItemModelEnum.bundle)
	}


	getBuildIndexData(){
		return SceneMgr.instance().getBuildIndexData(this.getID())
	}

	


}