import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import StorageItemModel from "./StorageItemModel";
/**
* %SheetName%
**/
export default class StorageMgr extends BaseModel {

	protected storageItemModelMgr: ModelManager<StorageItemModel> = new ModelManager()
	

    initData() {
		this.storageItemModelMgr.initWithData(ModuleManager.dataManager.get(StorageItemModel.CLASS_NAME), StorageItemModel)
		
	}
	
	getStorageItemModel(id){ return this.storageItemModelMgr.getByID(id)}
	
	getStorageItemModelList(){ return this.storageItemModelMgr.getList()}
	
	


}