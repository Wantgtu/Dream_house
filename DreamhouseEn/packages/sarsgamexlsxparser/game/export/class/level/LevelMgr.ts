import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import LevelItemModel from "./LevelItemModel";
/**
* %SheetName%
**/
export default class LevelMgr extends BaseModel {

	protected levelItemModelMgr: ModelManager<LevelItemModel> = new ModelManager()
	

    initData() {
		this.levelItemModelMgr.initWithData(ModuleManager.dataManager.get(LevelItemModel.CLASS_NAME), LevelItemModel)
		
	}
	
	getLevelItemModel(id){ return this.levelItemModelMgr.getByID(id)}
	
	getLevelItemModelList(){ return this.levelItemModelMgr.getList()}
	
	


}