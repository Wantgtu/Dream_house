import { DataModel } from "../../../cfw/cfw";


export enum StorageItemModelEnum{
	state,// 状态
	token,// 解锁金额
	foodID,// 存放的道具ID
	
}

/**
* 冰箱
**/
export default class StorageItemModel extends DataModel {

	static CLASS_NAME:string = 'StorageItemModel'
	constructor() {
		super(StorageItemModel.CLASS_NAME)
	}
	// 状态
	getState() {
		return this.getValue(StorageItemModelEnum.state)
	}
	setState(v:any) {
		this.setValue(StorageItemModelEnum.state,v)
	}
	// 解锁金额
	getToken() {
		return this.getValue(StorageItemModelEnum.token)
	}
	// 存放的道具ID
	getFoodID() {
		return this.getValue(StorageItemModelEnum.foodID)
	}
	setFoodID(v:any) {
		this.setValue(StorageItemModelEnum.foodID,v)
	}
	


}