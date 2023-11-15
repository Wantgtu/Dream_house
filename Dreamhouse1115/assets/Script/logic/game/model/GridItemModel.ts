import { DataModel } from "../../../cfw/cfw";
import GridFoodItemModel from "./GridFoodItemModel";
import { LocalValue } from "../../../cfw/local";
import GridFoodMgr from "./GridFoodMgr";
import { BaseItemModel } from "../../../cfw/model";


export enum GridItemModelEnum {
	state,// 状态
	foodID,// 放置食物
	outCount,// 产出个数
	time,// cd时间
}

/**
* 格子表
**/
export default class GridItemModel extends DataModel {

	static CLASS_NAME: string = 'GridItemModel'
	// protected food: GridFoodItemModel = null;
	protected foodKey: LocalValue
	constructor() {
		super(GridItemModel.CLASS_NAME)
	}

	init(id, data) {
		super.init(id, data)
		this.foodKey = new LocalValue('GridItemModel' + id, 0)
		if (!this.foodKey.isHaveData()) {
			let food = GridFoodMgr.instance().addNewFood(this.getInitFoodID())
			if (food)
				this.setFoodKey(food.getID())
		} else {
			let key = this.getFoodKey();
			// console.log('GridItemModel init  ', id, key)
			if (key != 0) {
				GridFoodMgr.instance().addFood(key)
			}
		}
	}

	setFoodKey(key: any) {
		// let oldKey = this.getFoodKey();
		// if (oldKey) {
		// 	if (isDelete) {
		// 		let food = this.getFood();
		// 		if (food) {
		// 			console.log('setFoodKey  isDelete  oldKey ', oldKey)
		// 			food.removeSelf();
		// 		}

		// 		// GridFoodMgr.instance().deleteFood(oldKey)
		// 	}
		// }
		this.foodKey.setValue(key)
		// this.emit(EventName.UPDATE_FOOD_STATE)
	}

	getFoodKey() {
		return this.foodKey.getValue();
	}

	getInitFoodID() {
		let id = this.getValue(GridItemModelEnum.foodID);
		return id
	}
	// 状态
	getState() {
		return this.getValue(GridItemModelEnum.state)
	}

	setState(s: number) {
		// console.log(' setState s ', s)
		this.setValue(GridItemModelEnum.state, s)
		this.emit(BaseItemModel.UPDATE_STATE)
	}
	// 放置食物
	getFood(): GridFoodItemModel {
		let key = this.getFoodKey();
		// console.log('getFood key =================  ', key)
		let m = GridFoodMgr.instance().getFood(key)
		return m;
	}


	getFoodID() {
		if (this.hasFood()) {
			return this.getFood().getFoodID()
		} else {
			return 0;
		}

	}

	hasFood() {
		let m = this.getFood();
		return m != null && m != undefined
	}



}