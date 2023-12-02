import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import SpecialTaskItemModel from "./SpecialTaskItemModel";
/**
* %SheetName%
**/
export default class SpecialtaskMgr extends BaseModel {

	protected specialTaskItemModelMgr: ModelManager<SpecialTaskItemModel> = new ModelManager()
	

    initData() {
		this.specialTaskItemModelMgr.initWithData(ModuleManager.dataManager.get(SpecialTaskItemModel.CLASS_NAME), SpecialTaskItemModel)
		
	}
	
	getSpecialTaskItemModel(id){ return this.specialTaskItemModelMgr.getByID(id)}
	
	getSpecialTaskItemModelList(){ return this.specialTaskItemModelMgr.getList()}
	
	


}