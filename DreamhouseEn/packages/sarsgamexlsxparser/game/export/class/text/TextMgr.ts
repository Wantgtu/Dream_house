import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import UITextModel from "./UITextModel";
/**
* %SheetName%
**/
export default class TextMgr extends BaseModel {

	protected uITextModelMgr: ModelManager<UITextModel> = new ModelManager()
	

    initData() {
		this.uITextModelMgr.initWithData(ModuleManager.dataManager.get(UITextModel.CLASS_NAME), UITextModel)
		
	}
	
	getUITextModel(id){ return this.uITextModelMgr.getByID(id)}
	
	getUITextModelList(){ return this.uITextModelMgr.getList()}
	
	


}