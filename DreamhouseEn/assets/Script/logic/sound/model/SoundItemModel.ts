import { DataModel } from "../../../cfw/cfw";
import { ModuleID } from "../../../config/ModuleConfig";


export enum SoundItemModelEnum {
	res,// res
	name,// 名称
	playCount,
	type,
	// path,

}

/**
* 音频
**/
export default class SoundItemModel extends DataModel {

	static CLASS_NAME: string = 'SoundItemModel'
	constructor() {
		super(SoundItemModel.CLASS_NAME)
	}
	// res
	getRes() {
		return this.getValue(SoundItemModelEnum.res)
	}
	// 名称
	getName() {
		return this.getValue(SoundItemModelEnum.name)
	}


	getPlayCount() {
		return this.getValue(SoundItemModelEnum.playCount)
	}

	getType() {
		return this.getValue(SoundItemModelEnum.type)
	}
	getPath() {
		return ''
	}

	getModuleID() {
		// let path: string = this.getPath();
		// if (path.indexOf('/') >= 0) {
		// 	return path.split('/')[0]
		// }
		return ModuleID.AUDIO;
	}
}