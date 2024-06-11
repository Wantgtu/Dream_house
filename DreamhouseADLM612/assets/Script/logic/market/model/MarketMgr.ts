import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import MarketItemModel from "./MarketItemModel";
import MarketTypeModel from "./MarketTypeModel";
import MarketItemModel2 from "./MarketItemModel2";
import CMgr from "../../../sdk/channel-ts/CMgr";
import { MarketItemModelEnum } from "./BaseMarketItemModel";
/**
* %SheetName%
**/
export default class MarketMgr extends BaseModel {

	protected marketItemModelMgr: ModelManager<MarketItemModel> = new ModelManager()
	protected marketTypeModelMgr: ModelManager<MarketTypeModel> = new ModelManager()
	protected marketItemModel2Mgr: ModelManager<MarketItemModel2> = new ModelManager()

	initData() {
		this.marketItemModelMgr.initWithData(ModuleManager.dataManager.get(MarketItemModel.CLASS_NAME), MarketItemModel)
		this.marketItemModel2Mgr.initWithData(ModuleManager.dataManager.get(MarketItemModel2.CLASS_NAME), MarketItemModel2)
		this.marketTypeModelMgr.initWithData(ModuleManager.dataManager.get(MarketTypeModel.CLASS_NAME), MarketTypeModel)



	}



	getMarketItemModel(id) {
		if (CMgr.helper.canMultyAd()) {
			return this.marketItemModelMgr.getByID(id)
		} else {
			return this.marketItemModel2Mgr.getByID(id)
		}

	}

	getMarketItemModelList() {
		if (CMgr.helper.canMultyAd()) {
			return this.marketItemModelMgr.getList()
		} else {
			return this.marketItemModel2Mgr.getList()
		}
	}

	getMarketTypeModel(id) { return this.marketTypeModelMgr.getByID(id) }

	getMarketTypeModelList() { return this.marketTypeModelMgr.getList() }


	getMarketList(type: number) {
		// console.log(' type == ', type)

		if (CMgr.helper.canMultyAd()) {
			return this.marketItemModelMgr.getIndexData(MarketItemModelEnum.type, type)
		} else {
			return this.marketItemModel2Mgr.getIndexData(MarketItemModelEnum.type, type)
		}
	}

	hasFood(foodID: number) {
		let type = this.getMarketTypeModel(1)
		if (type) {
			return type.hasFood(foodID)
		}
		return false
	}


}