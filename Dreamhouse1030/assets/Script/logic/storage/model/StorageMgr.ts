import { BaseModel, ModelManager, ItemState } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import StorageItemModel from "./StorageItemModel";
import GridFoodItemModel from "../../game/model/GridFoodItemModel";
/**
* %SheetName%
**/
export default class StorageMgr extends BaseModel {

	protected storageItemModelMgr: ModelManager<StorageItemModel> = new ModelManager()


	initData() {
		this.storageItemModelMgr.initWithData(ModuleManager.dataManager.get(StorageItemModel.CLASS_NAME), StorageItemModel)

	}

	getStorageItemModel(id) { return this.storageItemModelMgr.getByID(id) }

	getStorageItemModelList() { return this.storageItemModelMgr.getList() }



	addToStorage(food: GridFoodItemModel) {
		let box: StorageItemModel = this.getEmpty();
		if (box) {
			box.setFoodID(food.getID())
			return true;
		}
		return false;
	}

	getEmpty() {
		let list = this.getStorageItemModelList()
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			if (element.getState() == ItemState.GOT && element.getFoodID() == 0) {
				return element;
			}
		}
		return null;
	}

	setNextModel() {
		let list = this.getStorageItemModelList()
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			if (element.getState() == ItemState.CAN_GET) {
				element.setState(ItemState.NOT_GET)
				break;
			}
		}

	}


}