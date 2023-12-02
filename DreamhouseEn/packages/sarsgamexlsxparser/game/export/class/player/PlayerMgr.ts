import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import StateItemModel from "./StateItemModel";
/**
* %SheetName%
**/
export default class PlayerMgr extends BaseModel {

	protected stateItemModelMgr: ModelManager<StateItemModel> = new ModelManager()
	

    initData() {
		this.stateItemModelMgr.initWithData(ModuleManager.dataManager.get(StateItemModel.CLASS_NAME), StateItemModel)
		
	}
	
	getStateItemModel(id){ return this.stateItemModelMgr.getByID(id)}
	
	getStateItemModelList(){ return this.stateItemModelMgr.getList()}
	
	


}