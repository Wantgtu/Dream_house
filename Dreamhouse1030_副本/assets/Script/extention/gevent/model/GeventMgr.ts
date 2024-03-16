
import EventCheckItemModel, { EventCheckItemModelEnum } from "./EventCheckItemModel";
import EventItemModel, { EventItemModelEnum } from "./EventItemModel";
import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";

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

	getEventCheckItemModel(id) { return this.eventCheckItemModelMgr.getByID(id) }

	getEventCheckItemModelList() { return this.eventCheckItemModelMgr.getList() }

	getEventItemModel(id) { return this.eventItemModelMgr.getByID(id) }

	getNewEventItemModel(id) { return this.eventItemModelMgr.getNewModel(id, EventItemModel) }

	getEventItemModelList() { return this.eventItemModelMgr.getList() }

	// getIndexData() {
	// 	return this.eventItemModelMgr.getIndex(EventItemModelEnum.eventID)
	// }

	getCheckIndex(type: number) {
		return this.eventCheckItemModelMgr.getIndexData(EventCheckItemModelEnum.type, type)
	}

	getEventStep(eventID: number) {
		return this.eventItemModelMgr.getIndexData(EventItemModelEnum.eventID, eventID)
	}

}