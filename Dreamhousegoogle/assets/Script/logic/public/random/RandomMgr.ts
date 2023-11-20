import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import RandomItemModel, { RandomItemModelEnum } from "./RandomItemModel";
import Utils from "../../../cfw/tools/Utils";
import BagManager from "../bag/BagManager";
import RandomWeightModel from "./RandomWeightModel";
/**
* %SheetName%
**/
export default class RandomMgr extends BaseModel {

	protected randomItemModelMgr: ModelManager<RandomItemModel> = new ModelManager()
	protected randomWeightModelMgr: ModelManager<RandomWeightModel> = new ModelManager()

	initData() {
		this.randomItemModelMgr.initWithData(ModuleManager.dataManager.get(RandomItemModel.CLASS_NAME), RandomItemModel)
		this.randomWeightModelMgr.initWithData(ModuleManager.dataManager.get(RandomWeightModel.CLASS_NAME), RandomWeightModel)
	}

	getRandomItemModel(id) { return this.randomItemModelMgr.getByID(id) }

	getRandomItemModelList() { return this.randomItemModelMgr.getList() }
	getRandomWeightModel(id) { return this.randomWeightModelMgr.getByID(id) }

	getRandomWeightModelList() { return this.randomWeightModelMgr.getList() }
	getList(special: number) {
		return this.randomItemModelMgr.getIndexData(RandomItemModelEnum.special, special)
	}

	getRandomItem(special: number) {
		let array = this.getList(special)
		let itemID = 0;
		let random = 0;
		for (let index = 0; index < array.length; index++) {
			const element = array[index];
			random += element.getWeight();
			let r = Utils.random(0, 1000)
			if (r <= random) {
				itemID = element.getItem();
				break;
			}
		}
		// console.log('itemid ', itemID)
		return BagManager.instance().getNewItemModel(itemID, 1)
	}


	getItem() {
		return this.getRandomItem(this.getRandom())
	}

	private getRandom() {
		let list = this.getRandomWeightModelList();
		let random = 0;
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			let r = Utils.random(0, 100)
			random += element.getWeight();
			if (r <= random) {
				return index;
			}
		}
		return 0;
	}


}