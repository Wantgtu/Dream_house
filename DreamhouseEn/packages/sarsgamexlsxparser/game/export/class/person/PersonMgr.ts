import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import PersonItemModel from "./PersonItemModel";
/**
* %SheetName%
**/
export default class PersonMgr extends BaseModel {

	protected personItemModelMgr: ModelManager<PersonItemModel> = new ModelManager()
	

    initData() {
		this.personItemModelMgr.initWithData(ModuleManager.dataManager.get(PersonItemModel.CLASS_NAME), PersonItemModel)
		
	}
	
	getPersonItemModel(id){ return this.personItemModelMgr.getByID(id)}
	
	getPersonItemModelList(){ return this.personItemModelMgr.getList()}
	
	


}