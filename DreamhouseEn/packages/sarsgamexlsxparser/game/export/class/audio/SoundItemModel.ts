import { DataModel } from "../../../cfw/cfw";


export enum SoundItemModelEnum{
	res,// res
	name,// 名称
	playCount,// 是否循环
	type,// 类型
	
}

/**
* 音频
**/
export default class SoundItemModel extends DataModel {

	static CLASS_NAME:string = 'SoundItemModel'
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
	// 是否循环
	getPlayCount() {
		return this.getValue(SoundItemModelEnum.playCount)
	}
	// 类型
	getType() {
		return this.getValue(SoundItemModelEnum.type)
	}
	


}