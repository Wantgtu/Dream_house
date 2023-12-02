import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import BoxPopItemModel from "./BoxPopItemModel";
/**
* %SheetName%
**/
export default class BoxpopMgr extends BaseModel {

	protected boxPopItemModelMgr: ModelManager<BoxPopItemModel> = new ModelManager()
	

    initData() {
		this.boxPopItemModelMgr.initWithData(ModuleManager.dataManager.get(BoxPopItemModel.CLASS_NAME), BoxPopItemModel)
		
	}
	
	getBoxPopItemModel(id){ return this.boxPopItemModelMgr.getByID(id)}
	
	getBoxPopItemModelList(){ return this.boxPopItemModelMgr.getList()}
	
	


}