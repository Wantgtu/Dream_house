import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import MarketItemModel from "./MarketItemModel";import MarketTypeModel from "./MarketTypeModel";import MarketItemModel2 from "./MarketItemModel2";
/**
* %SheetName%
**/
export default class MarketMgr extends BaseModel {

	protected marketItemModelMgr: ModelManager<MarketItemModel> = new ModelManager()
	protected marketTypeModelMgr: ModelManager<MarketTypeModel> = new ModelManager()
	protected marketItemModel2Mgr: ModelManager<MarketItemModel2> = new ModelManager()
	

    initData() {
		this.marketItemModelMgr.initWithData(ModuleManager.dataManager.get(MarketItemModel.CLASS_NAME), MarketItemModel)
		this.marketTypeModelMgr.initWithData(ModuleManager.dataManager.get(MarketTypeModel.CLASS_NAME), MarketTypeModel)
		this.marketItemModel2Mgr.initWithData(ModuleManager.dataManager.get(MarketItemModel2.CLASS_NAME), MarketItemModel2)
		
	}
	
	getMarketItemModel(id){ return this.marketItemModelMgr.getByID(id)}
	
	getMarketItemModelList(){ return this.marketItemModelMgr.getList()}
	
	getMarketTypeModel(id){ return this.marketTypeModelMgr.getByID(id)}
	
	getMarketTypeModelList(){ return this.marketTypeModelMgr.getList()}
	
	getMarketItemModel2(id){ return this.marketItemModel2Mgr.getByID(id)}
	
	getMarketItemModel2List(){ return this.marketItemModel2Mgr.getList()}
	
	


}