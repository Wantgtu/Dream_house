import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import LuckySpinItemModel from "./LuckySpinItemModel";
/**
* %SheetName%
**/
export default class LuckyspinMgr extends BaseModel {

	protected luckySpinItemModelMgr: ModelManager<LuckySpinItemModel> = new ModelManager()
	

    initData() {
		this.luckySpinItemModelMgr.initWithData(ModuleManager.dataManager.get(LuckySpinItemModel.CLASS_NAME), LuckySpinItemModel)
		
	}
	
	getLuckySpinItemModel(id){ return this.luckySpinItemModelMgr.getByID(id)}
	
	getLuckySpinItemModelList(){ return this.luckySpinItemModelMgr.getList()}
	
	


}