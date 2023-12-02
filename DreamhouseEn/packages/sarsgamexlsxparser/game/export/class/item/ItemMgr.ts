import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import ItemModel from "./ItemModel";
/**
* %SheetName%
**/
export default class ItemMgr extends BaseModel {

	protected itemModelMgr: ModelManager<ItemModel> = new ModelManager()
	

    initData() {
		this.itemModelMgr.initWithData(ModuleManager.dataManager.get(ItemModel.CLASS_NAME), ItemModel)
		
	}
	
	getItemModel(id){ return this.itemModelMgr.getByID(id)}
	
	getItemModelList(){ return this.itemModelMgr.getList()}
	
	


}