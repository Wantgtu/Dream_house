import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import RandomItemModel from "./RandomItemModel";import RandomWeightModel from "./RandomWeightModel";
/**
* %SheetName%
**/
export default class RandomMgr extends BaseModel {

	protected randomItemModelMgr: ModelManager<RandomItemModel> = new ModelManager()
	protected randomWeightModelMgr: ModelManager<RandomWeightModel> = new ModelManager()
	

    initData() {
		this.randomItemModelMgr.initWithData(ModuleManager.dataManager.get(RandomItemModel.CLASS_NAME), RandomItemModel)
		this.randomWeightModelMgr.initWithData(ModuleManager.dataManager.get(RandomWeightModel.CLASS_NAME), RandomWeightModel)
		
	}
	
	getRandomItemModel(id){ return this.randomItemModelMgr.getByID(id)}
	
	getRandomItemModelList(){ return this.randomItemModelMgr.getList()}
	
	getRandomWeightModel(id){ return this.randomWeightModelMgr.getByID(id)}
	
	getRandomWeightModelList(){ return this.randomWeightModelMgr.getList()}
	
	


}