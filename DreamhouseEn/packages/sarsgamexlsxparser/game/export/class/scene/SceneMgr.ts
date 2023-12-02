import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import BuildItemModel from "./BuildItemModel";import SceneItemModel from "./SceneItemModel";
/**
* %SheetName%
**/
export default class SceneMgr extends BaseModel {

	protected buildItemModelMgr: ModelManager<BuildItemModel> = new ModelManager()
	protected sceneItemModelMgr: ModelManager<SceneItemModel> = new ModelManager()
	

    initData() {
		this.buildItemModelMgr.initWithData(ModuleManager.dataManager.get(BuildItemModel.CLASS_NAME), BuildItemModel)
		this.sceneItemModelMgr.initWithData(ModuleManager.dataManager.get(SceneItemModel.CLASS_NAME), SceneItemModel)
		
	}
	
	getBuildItemModel(id){ return this.buildItemModelMgr.getByID(id)}
	
	getBuildItemModelList(){ return this.buildItemModelMgr.getList()}
	
	getSceneItemModel(id){ return this.sceneItemModelMgr.getByID(id)}
	
	getSceneItemModelList(){ return this.sceneItemModelMgr.getList()}
	
	


}