import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import EventCheckItemModel from "./EventCheckItemModel";import EventItemModel from "./EventItemModel";
/**
* %SheetName%
**/
export default class GeventMgr extends BaseModel {

	protected eventCheckItemModelMgr: ModelManager<EventCheckItemModel> = new ModelManager()
	protected eventItemModelMgr: ModelManager<EventItemModel> = new ModelManager()
	

    initData() {
		this.eventCheckItemModelMgr.initWithData(ModuleManager.dataManager.get(EventCheckItemModel.CLASS_NAME), EventCheckItemModel)
		this.eventItemModelMgr.initWithData(ModuleManager.dataManager.get(EventItemModel.CLASS_NAME), EventItemModel)
		
	}
	
	getEventCheckItemModel(id){ return this.eventCheckItemModelMgr.getByID(id)}
	
	getEventCheckItemModelList(){ return this.eventCheckItemModelMgr.getList()}
	
	getEventItemModel(id){ return this.eventItemModelMgr.getByID(id)}
	
	getEventItemModelList(){ return this.eventItemModelMgr.getList()}
	
	


}