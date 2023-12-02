import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import DailyTaskItemModel from "./DailyTaskItemModel";import TaskItemModel from "./TaskItemModel";
/**
* %SheetName%
**/
export default class TaskMgr extends BaseModel {

	protected dailyTaskItemModelMgr: ModelManager<DailyTaskItemModel> = new ModelManager()
	protected taskItemModelMgr: ModelManager<TaskItemModel> = new ModelManager()
	

    initData() {
		this.dailyTaskItemModelMgr.initWithData(ModuleManager.dataManager.get(DailyTaskItemModel.CLASS_NAME), DailyTaskItemModel)
		this.taskItemModelMgr.initWithData(ModuleManager.dataManager.get(TaskItemModel.CLASS_NAME), TaskItemModel)
		
	}
	
	getDailyTaskItemModel(id){ return this.dailyTaskItemModelMgr.getByID(id)}
	
	getDailyTaskItemModelList(){ return this.dailyTaskItemModelMgr.getList()}
	
	getTaskItemModel(id){ return this.taskItemModelMgr.getByID(id)}
	
	getTaskItemModelList(){ return this.taskItemModelMgr.getList()}
	
	


}