import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import ActivityItemModel from "./ActivityItemModel";
/**
* %SheetName%
**/
export default class ActivityMgr extends BaseModel {

	protected activityItemModelMgr: ModelManager<ActivityItemModel> = new ModelManager()
	

    initData() {
		this.activityItemModelMgr.initWithData(ModuleManager.dataManager.get(ActivityItemModel.CLASS_NAME), ActivityItemModel)
		
	}
	
	getActivityItemModel(id){ return this.activityItemModelMgr.getByID(id)}
	
	getActivityItemModelList(){ return this.activityItemModelMgr.getList()}
	
	


}