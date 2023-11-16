import { BaseModel, ModelManager, ItemState } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import FoodItemModel, { FoodItemModelEnum } from "./FoodItemModel";
import FoodTypeModel from "./FoodTypeModel";
import GridItemModel from "./GridItemModel";
import { FoodOutType } from "../../../config/Config";
import FoodRareItemModel from "./FoodRareItemModel";
import Utils from "../../../cfw/tools/Utils";
/**
* %SheetName%
**/
export default class FoodMgr extends BaseModel {

	protected foodItemModelMgr: ModelManager<FoodItemModel> = new ModelManager()
	protected foodTypeModelMgr: ModelManager<FoodTypeModel> = new ModelManager()
	protected gridItemModelMgr: ModelManager<GridItemModel> = new ModelManager()
	protected foodRareItemModelMgr: ModelManager<FoodRareItemModel> = new ModelManager()
	protected marketList: FoodItemModel[] = []
	initData() {
		this.foodItemModelMgr.initWithData(ModuleManager.dataManager.get(FoodItemModel.CLASS_NAME), FoodItemModel)
		this.foodTypeModelMgr.initWithData(ModuleManager.dataManager.get(FoodTypeModel.CLASS_NAME), FoodTypeModel)
		this.gridItemModelMgr.initWithData(ModuleManager.dataManager.get(GridItemModel.CLASS_NAME), GridItemModel)
		this.foodRareItemModelMgr.initWithData(ModuleManager.dataManager.get(FoodRareItemModel.CLASS_NAME), FoodRareItemModel)
		let list = this.getFoodItemModelList()
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			if (element.getMarketPrice() > 0) {
				this.marketList.push(element)
			}
		}
	}
	getNewItemModel(id, num: number = 1) {
		let model = this.getNewFoodItemModel(id)
		model.setNum(num, false)
		return model;
	}


	getRandomFoodID() {
		let temp = []
		for (let index = 0; index < this.marketList.length; index++) {
			const element = this.marketList[index];
			temp.push(element)
		}

		return temp;
	}
	getFoodByFoodType(type: any) {
		let list = this.getGridItemModelList()
		let count = list.length;
		for (let index = 0; index < count; index++) {
			let m = list[index]
			let f = m.getFood();
			if (f && f.getFType() == type) {
				return f;
			}
		}
		return null;
	}

	getFoodByFoodID(foodID: any) {
		let list = this.getGridItemModelList()
		let count = list.length
		for (let index = 0; index < count; index++) {
			// let id = 
			let m = list[index]
			if (m && m.getFoodID() == foodID) {
				return m;
			}
		}
		return null;
	}

	getFoodCountByID(foodID: any) {
		let c = 0;
		let list = this.getGridItemModelList()
		let count = list.length
		for (let index = 0; index < count; index++) {
			// let id = 
			let m = list[index]
			if (m && m.getFoodID() == foodID) {
				c++;
			}
		}
		return c;
	}


	// addItem(foodID: number) {
	// 	this.addItemModel(this.getNewItemModel(foodID))
	// }

	// addItemModel(food: FoodItemModel) {
	// 	let m = GridFoodMgr.instance().getNewFood(food.getID())
	// 	this.rewardItems.push(m.getID())
	// this.bufferList.push(food)
	// }

	// delete(food: FoodItemModel) {
	// let index = this.bufferList.indexOf(food)
	// if (index >= 0) {
	// this.rewardItems.delete(food.getID())
	// 	this.bufferList.splice(index, 1)
	// }

	// }

	// getFood() {
	// 	let m = this.bufferList.shift()
	// 	this.delete(m)
	// 	return m;
	// }

	// hasFood(foodID: number) {
	// 	// console.log('hasFood foodID ', foodID)
	// 	let list: GridItemModel[] = this.gridItemModelMgr.getList();
	// 	for (let index = 0; index < list.length; index++) {
	// 		const element = list[index];
	// 		if (element.hasFood()) {
	// 			let f = element.getFoodID();
	// 			// console.log(' ffffffffffffffffff ', f)
	// 			if (f == foodID) {
	// 				return true;
	// 			}
	// 		}

	// 	}

	// 	return false;
	// }

	// gridDelete(foodID: number) {
	// 	let list: GridItemModel[] = this.gridItemModelMgr.getList();
	// 	for (let index = 0; index < list.length; index++) {
	// 		const element = list[index];
	// 		let food = element.getFood();
	// 		// console.log(' element.hasFood() ', element.hasFood())
	// 		if (food) {
	// 			let f = food.getFoodID();
	// 			console.log('gridDelete f  ', f, foodID)
	// 			if (f == foodID) {
	// 				element.setFoodKey(0)
	// 				break;
	// 			}

	// 		} else {
	// 			console.log('food is null  gridDelete foodID ', foodID)
	// 		}

	// 		// console.log(' ffffffffffffffffff ', f)

	// 	}
	// }

	getNewFoodItemModel(id) {
		return this.foodItemModelMgr.getNewModel(id, FoodItemModel)
	}

	getFoodItemModel(id) { return this.foodItemModelMgr.getByID(id) }

	getFoodItemModelList() { return this.foodItemModelMgr.getList() }

	getFoodTypeModel(id) { return this.foodTypeModelMgr.getByID(id) }

	getFoodTypeModelList() { return this.foodTypeModelMgr.getList() }

	getGridItemModel(id) { return this.gridItemModelMgr.getByID(id) }

	getGridItemModelList() { return this.gridItemModelMgr.getList() }



	getFoodIndexData(type: number) {
		return this.foodItemModelMgr.getIndexData(FoodItemModelEnum.ftype, type)
	}


	getOutFood(m: FoodItemModel) {
		let temp = []
		let output = m.getOutput();

		if (output && output.length > 0) {
			let count = output.length / 2;
			let type = m.getOutType();
			switch (type) {
				case FoodOutType.NO_OUT:
					break;
				case FoodOutType.CHOICE_ITEM:
					break;
				case FoodOutType.OUT_COST_ITEM:

					// for (let index = 0; index < count; index++) {
					// 	const foodID = output[index * 2];
					// 	let num = output[index * 2 + 1]
					// 	temp.push(this.getFoodItemModel(foodID))
					// }
					break;
				case FoodOutType.OUT_ITEM_DESTORY:
					for (let index = 0; index < output.length; index++) {
						const foodID = output[index];
						temp.push(this.getFoodItemModel(foodID))
					}
					break;
				case FoodOutType.OUT_ITEM_WITH_OPEN_CD:
					for (let index = 0; index < output.length; index++) {
						const foodID = output[index];
						temp.push(this.getFoodItemModel(foodID))
					}
					break;
				case FoodOutType.OUT_RANDOM_AND_CD:
					for (let index = 0; index < count; index++) {
						const foodID = output[index * 2];
						let num = output[index * 2 + 1]
						let food = this.getFoodItemModel(foodID);
						food.setNum(num)
						temp.push(food)
					}
					break;
				case FoodOutType.OUT_RANDOM_COUNT_DESTROY:
					for (let index = 0; index < count; index++) {
						const foodID = output[index * 2];
						let num = output[index * 2 + 1]
						let food = this.getFoodItemModel(foodID);
						// console.log('OUT_RANDOM_COUNT_DESTROY num ', num)
						food.setNum(num)
						temp.push(food)
					}
					break;
			}
		}
		return temp
	}


	getItemByRare(rare: number) {
		let list = this.foodItemModelMgr.getIndexData(FoodItemModelEnum.rare, rare)
		if (list && list.length > 0) {
			let r = Utils.random(0, list.length)
			let item = list[r]
			if (item) {
				return this.getNewFoodItemModel(item.getID())
			} else {
				return null;
			}

		}
		return null;
	}

	getItemByRareList(rareList: number[]) {
		let rare = rareList[Utils.random(0, rareList.length)]
		return this.getItemByRare(rare)
	}

}