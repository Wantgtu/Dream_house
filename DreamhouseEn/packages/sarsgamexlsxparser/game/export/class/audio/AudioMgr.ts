import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import SoundItemModel from "./SoundItemModel";
/**
* %SheetName%
**/
export default class AudioMgr extends BaseModel {

	protected soundItemModelMgr: ModelManager<SoundItemModel> = new ModelManager()
	

    initData() {
		this.soundItemModelMgr.initWithData(ModuleManager.dataManager.get(SoundItemModel.CLASS_NAME), SoundItemModel)
		
	}
	
	getSoundItemModel(id){ return this.soundItemModelMgr.getByID(id)}
	
	getSoundItemModelList(){ return this.soundItemModelMgr.getList()}
	
	


}