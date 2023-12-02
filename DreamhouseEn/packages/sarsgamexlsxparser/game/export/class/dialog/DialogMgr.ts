import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import DialogItemModel from "./DialogItemModel";
/**
* %SheetName%
**/
export default class DialogMgr extends BaseModel {

	protected dialogItemModelMgr: ModelManager<DialogItemModel> = new ModelManager()
	

    initData() {
		this.dialogItemModelMgr.initWithData(ModuleManager.dataManager.get(DialogItemModel.CLASS_NAME), DialogItemModel)
		
	}
	
	getDialogItemModel(id){ return this.dialogItemModelMgr.getByID(id)}
	
	getDialogItemModelList(){ return this.dialogItemModelMgr.getList()}
	
	


}