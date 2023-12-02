import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import BuyItemModel from "./BuyItemModel";
/**
* %SheetName%
**/
export default class BuyMgr extends BaseModel {

	protected buyItemModelMgr: ModelManager<BuyItemModel> = new ModelManager()
	

    initData() {
		this.buyItemModelMgr.initWithData(ModuleManager.dataManager.get(BuyItemModel.CLASS_NAME), BuyItemModel)
		
	}
	
	getBuyItemModel(id){ return this.buyItemModelMgr.getByID(id)}
	
	getBuyItemModelList(){ return this.buyItemModelMgr.getList()}
	
	


}