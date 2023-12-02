import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import RedTipItemModel from "./RedTipItemModel";import RedTipStepModel from "./RedTipStepModel";import RedTipWidgetModel from "./RedTipWidgetModel";
/**
* %SheetName%
**/
export default class RedtipMgr extends BaseModel {

	protected redTipItemModelMgr: ModelManager<RedTipItemModel> = new ModelManager()
	protected redTipStepModelMgr: ModelManager<RedTipStepModel> = new ModelManager()
	protected redTipWidgetModelMgr: ModelManager<RedTipWidgetModel> = new ModelManager()
	

    initData() {
		this.redTipItemModelMgr.initWithData(ModuleManager.dataManager.get(RedTipItemModel.CLASS_NAME), RedTipItemModel)
		this.redTipStepModelMgr.initWithData(ModuleManager.dataManager.get(RedTipStepModel.CLASS_NAME), RedTipStepModel)
		this.redTipWidgetModelMgr.initWithData(ModuleManager.dataManager.get(RedTipWidgetModel.CLASS_NAME), RedTipWidgetModel)
		
	}
	
	getRedTipItemModel(id){ return this.redTipItemModelMgr.getByID(id)}
	
	getRedTipItemModelList(){ return this.redTipItemModelMgr.getList()}
	
	getRedTipStepModel(id){ return this.redTipStepModelMgr.getByID(id)}
	
	getRedTipStepModelList(){ return this.redTipStepModelMgr.getList()}
	
	getRedTipWidgetModel(id){ return this.redTipWidgetModelMgr.getByID(id)}
	
	getRedTipWidgetModelList(){ return this.redTipWidgetModelMgr.getList()}
	
	


}