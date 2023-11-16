import { DataModel } from "../../../cfw/cfw";
import FoodMgr from "./FoodMgr";
import { ModuleID } from "../../../config/ModuleConfig";
import { TimeHelper } from "../../../cfw/time";
import { ItemState } from "../../../cfw/model";
import { GEvent } from "../../../cfw/event";
import { EventName } from "../../../config/Config";
import LangManager from "../../../cfw/tools/LangManager";
import MarketMgr from "../../market/model/MarketMgr";


export enum FoodItemModelEnum {
	name,// 名称
	rare,
	ftype,// 类型
	state,
	icon,// 图标
	nextID,//
	scale,// 缩放
	price,// 价格
	outType,// 音效
	output,// 产出
	outCount,// 产出个数
	time,// cd时间
	openPrice,// 解锁价格
	splitRandom,
	level,
	sellPrice,
	marketPrice,

}

/**
* 食物表
**/
export default class FoodItemModel extends DataModel {

	static CLASS_NAME: string = 'FoodItemModel'

	constructor() {
		super(FoodItemModel.CLASS_NAME)
	}


	// init(id, data) {
	// 	super.init(id, data)
	// 	let time = this.getTime();
	// 	// console.log(' time =========== ', time, ' this.isTimeFraze() ',this.isTimeFraze())
	// 	if (time <= 0) {
	// 		if (this.isTimeFraze())
	// 			this.setOutCount(this.getCfgValue(FoodItemModelEnum.outCount))
	// 	}
	// }

	getSplitRandom() {
		return this.getValue(FoodItemModelEnum.splitRandom)
	}

	getRare() {
		return this.getValue(FoodItemModelEnum.rare)
	}

	getSellPrice() {
		return this.getValue(FoodItemModelEnum.sellPrice)
	}
	// 名称
	getName() {
		let langID = this.getValue(FoodItemModelEnum.name)
		return langID
	}
	// 类型
	getFType() {
		return this.getValue(FoodItemModelEnum.ftype)
	}
	// 图标
	getIcon() {
		return 'texture/props'
	}

	getSpriteFrame() {
		return this.getValue(FoodItemModelEnum.icon)
	}
	// 缩放
	getScale() {
		return this.getValue(FoodItemModelEnum.scale)
	}
	// 价格
	getPrice() {
		return this.getValue(FoodItemModelEnum.price)
	}
	// 音效
	// getSound() {
	// 	return this.getValue(FoodItemModelEnum.sound)
	// }
	// 产出
	getOutput() {
		return this.getValue(FoodItemModelEnum.output)
	}
	// 产出个数
	getOutCount() {
		return this.getValue(FoodItemModelEnum.outCount)
	}

	setOutCount(c: number) {
		this.setValue(FoodItemModelEnum.outCount, c)
		if (c == 0) {
			this.setCDTime()
		}
	}

	getMarketPrice() {
		return this.getValue(FoodItemModelEnum.marketPrice)
	}

	getFoodState() {
		return this.getValue(FoodItemModelEnum.state)
	}

	setFoodState(s: number) {
		this.setValue(FoodItemModelEnum.state, s)
	}

	getBeBornInitID() {
		let type = FoodMgr.instance().getFoodTypeModel(this.getFType())
		if (type) {
			return type.getBeBornInitID();
		}
		return 0;
	}

	updateFoodState() {
		if (this.getFoodState() == ItemState.NOT_GET) {
			this.setFoodState(ItemState.GOT)
			GEvent.instance().emit(EventName.CHANGE_FOOD_STATE)
		}
	}

	getNum() {
		if (this.num == 0) {
			this.num = 1
		}
		return super.getNum()
	}

	// getKey() {
	// 	let value = this.getValue(FoodItemModelEnum.marketPrice)
	// 	if (!value) {
	// 		value = Date.now() + this.getID();
	// 		this.setKey(value)
	// 	}
	// 	return value
	// }

	// setKey(k: string) {
	// 	this.setValue(FoodItemModelEnum.marketPrice, k)
	// }
	// cd时间
	getTime() {
		return this.getValue(FoodItemModelEnum.time)
	}

	setTime(t: number) {
		this.setValue(FoodItemModelEnum.time, t)
	}
	// 解锁价格
	getOpenPrice() {
		return this.getValue(FoodItemModelEnum.openPrice)
	}
	hasNext() {
		// console.log(' this.model.getNextID() ',this.model.getNextID())
		return this.getNextID() > 0
	}
	isMaxLevel() {
		return !this.hasNext();
	}

	setCDTime() {
		this.setTime(this.getCfgValue(FoodItemModelEnum.time))
	}

	clearCDTime() {
		this.setOutCount(this.getCfgValue(FoodItemModelEnum.outCount))
		this.setTime(0)
	}

	canOutput() {
		let out: number[] = this.getOutput();
		return out && out.length > 0
	}

	// canDelete() {
	// 	let out: number[] = this.getOutput();
	// 	return out.length <= 0
	// }

	// isTimeFraze() {
	// 	if (this.canOutput() && this.getOutCount() == 0) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

	canSell() {
		return this.getSellPrice() > 0;
	}

	getNextModel() {
		let nextID = parseInt(this.getID()) + 1
		let nextModel: FoodItemModel = FoodMgr.instance().getNewFoodItemModel(nextID)
		if (!nextModel) {
			return null;
		}
		if (nextModel.getFType() == this.getFType()) {
			return nextModel;
		}
		return null;
	}

	getLevel() {
		return this.getValue(FoodItemModelEnum.level)
	}


	getModuleID() {
		return ModuleID.GAME;
	}

	getNextID() {
		return this.getValue(FoodItemModelEnum.nextID)
	}

	getOutType() {
		return this.getValue(FoodItemModelEnum.outType)
	}

	isCostEnergy() {
		let type = FoodMgr.instance().getFoodTypeModel(this.getFType())
		if (type) {
			return type.isCostEnergy() || this.getID() == 30024;
		}
		return false;
	}

	isInMarket() {
		return MarketMgr.instance().hasFood(this.getID())
	}
}