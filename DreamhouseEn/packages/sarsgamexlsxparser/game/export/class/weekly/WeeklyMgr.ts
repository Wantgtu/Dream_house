import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import WeeklyItemModel from "./WeeklyItemModel";
/**
* %SheetName%
**/
export default class WeeklyMgr extends BaseModel {

	protected weeklyItemModelMgr: ModelManager<WeeklyItemModel> = new ModelManager()
	

    initData() {
		this.weeklyItemModelMgr.initWithData(ModuleManager.dataManager.get(WeeklyItemModel.CLASS_NAME), WeeklyItemModel)
		
	}
	
	getWeeklyItemModel(id){ return this.weeklyItemModelMgr.getByID(id)}
	
	getWeeklyItemModelList(){ return this.weeklyItemModelMgr.getList()}
	
	


}