import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import PlayGameModel from "./PlayGameModel";
/**
* %SheetName%
**/
export default class PlaygameMgr extends BaseModel {

	protected playGameModelMgr: ModelManager<PlayGameModel> = new ModelManager()
	

    initData() {
		this.playGameModelMgr.initWithData(ModuleManager.dataManager.get(PlayGameModel.CLASS_NAME), PlayGameModel)
		
	}
	
	getPlayGameModel(id){ return this.playGameModelMgr.getByID(id)}
	
	getPlayGameModelList(){ return this.playGameModelMgr.getList()}
	
	


}