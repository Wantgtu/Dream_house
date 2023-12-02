import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import FoodItemModel from "./FoodItemModel";import FoodTypeModel from "./FoodTypeModel";import FoodRareItemModel from "./FoodRareItemModel";import GridItemModel from "./GridItemModel";
/**
* %SheetName%
**/
export default class FoodMgr extends BaseModel {

	protected foodItemModelMgr: ModelManager<FoodItemModel> = new ModelManager()
	protected foodTypeModelMgr: ModelManager<FoodTypeModel> = new ModelManager()
	protected foodRareItemModelMgr: ModelManager<FoodRareItemModel> = new ModelManager()
	protected gridItemModelMgr: ModelManager<GridItemModel> = new ModelManager()
	

    initData() {
		this.foodItemModelMgr.initWithData(ModuleManager.dataManager.get(FoodItemModel.CLASS_NAME), FoodItemModel)
		this.foodTypeModelMgr.initWithData(ModuleManager.dataManager.get(FoodTypeModel.CLASS_NAME), FoodTypeModel)
		this.foodRareItemModelMgr.initWithData(ModuleManager.dataManager.get(FoodRareItemModel.CLASS_NAME), FoodRareItemModel)
		this.gridItemModelMgr.initWithData(ModuleManager.dataManager.get(GridItemModel.CLASS_NAME), GridItemModel)
		
	}
	
	getFoodItemModel(id){ return this.foodItemModelMgr.getByID(id)}
	
	getFoodItemModelList(){ return this.foodItemModelMgr.getList()}
	
	getFoodTypeModel(id){ return this.foodTypeModelMgr.getByID(id)}
	
	getFoodTypeModelList(){ return this.foodTypeModelMgr.getList()}
	
	getFoodRareItemModel(id){ return this.foodRareItemModelMgr.getByID(id)}
	
	getFoodRareItemModelList(){ return this.foodRareItemModelMgr.getList()}
	
	getGridItemModel(id){ return this.gridItemModelMgr.getByID(id)}
	
	getGridItemModelList(){ return this.gridItemModelMgr.getList()}
	
	


}