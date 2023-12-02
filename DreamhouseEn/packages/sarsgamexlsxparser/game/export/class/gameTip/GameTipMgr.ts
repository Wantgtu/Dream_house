import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import GameTipModel from "./GameTipModel";
/**
* %SheetName%
**/
export default class GameTipMgr extends BaseModel {

	protected gameTipModelMgr: ModelManager<GameTipModel> = new ModelManager()
	

    initData() {
		this.gameTipModelMgr.initWithData(ModuleManager.dataManager.get(GameTipModel.CLASS_NAME), GameTipModel)
		
	}
	
	getGameTipModel(id){ return this.gameTipModelMgr.getByID(id)}
	
	getGameTipModelList(){ return this.gameTipModelMgr.getList()}
	
	


}