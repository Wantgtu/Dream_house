import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import GuideItemModel from "./GuideItemModel";import GuideNodeModel from "./GuideNodeModel";import GuideFuncModel from "./GuideFuncModel";
/**
* %SheetName%
**/
export default class GuideMgr extends BaseModel {

	protected guideItemModelMgr: ModelManager<GuideItemModel> = new ModelManager()
	protected guideNodeModelMgr: ModelManager<GuideNodeModel> = new ModelManager()
	protected guideFuncModelMgr: ModelManager<GuideFuncModel> = new ModelManager()
	

    initData() {
		this.guideItemModelMgr.initWithData(ModuleManager.dataManager.get(GuideItemModel.CLASS_NAME), GuideItemModel)
		this.guideNodeModelMgr.initWithData(ModuleManager.dataManager.get(GuideNodeModel.CLASS_NAME), GuideNodeModel)
		this.guideFuncModelMgr.initWithData(ModuleManager.dataManager.get(GuideFuncModel.CLASS_NAME), GuideFuncModel)
		
	}
	
	getGuideItemModel(id){ return this.guideItemModelMgr.getByID(id)}
	
	getGuideItemModelList(){ return this.guideItemModelMgr.getList()}
	
	getGuideNodeModel(id){ return this.guideNodeModelMgr.getByID(id)}
	
	getGuideNodeModelList(){ return this.guideNodeModelMgr.getList()}
	
	getGuideFuncModel(id){ return this.guideFuncModelMgr.getByID(id)}
	
	getGuideFuncModelList(){ return this.guideFuncModelMgr.getList()}
	
	


}