import { DataModel } from "../../../cfw/cfw";
import GridFoodItemModel from "../../game/model/GridFoodItemModel";
import GridFoodMgr from "../../game/model/GridFoodMgr";
import { BaseItemModel } from "../../../cfw/model";


export enum StorageItemModelEnum {
	state,// 状态
	token,// 解锁金额
	foodID,// 存放的道具ID

}

/**
* 冰箱
**/
export default class StorageItemModel extends DataModel {

	static CLASS_NAME: string = 'StorageItemModel'
	constructor() {
		super(StorageItemModel.CLASS_NAME)
	}
	// 状态
	getState() {
		return this.getValue(StorageItemModelEnum.state)
	}
	// 解锁金额
	getToken() {
		return this.getValue(StorageItemModelEnum.token)
	}
	// 存放的道具ID
	getFoodID() {
		return this.getValue(StorageItemModelEnum.foodID)
	}

	getFood(): GridFoodItemModel {
		let id = this.getFoodID();
		if (id > 0) {
			let food = GridFoodMgr.instance().getFood(id)
			if (!food) {
				food = GridFoodMgr.instance().addFood(id)
			}
			return food;
		}
		return null;
	}
	removeFood() {

		this.setFoodID(0)

	}

	setFoodID(id: number) {
		this.setValue(StorageItemModelEnum.foodID, id)
	}

	setState(s: number) {
		this.setValue(StorageItemModelEnum.state, s)
		this.emit(BaseItemModel.UPDATE_STATE)
	}



}