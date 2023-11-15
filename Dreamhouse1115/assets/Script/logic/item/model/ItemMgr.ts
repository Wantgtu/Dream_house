import { BaseModel, ModelManager } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import ItemModel from "./ItemModel";
import { GEvent } from "../../../cfw/event";
import { EventName, ItemID, ENERGY_TIME, ENERGY_MAX } from "../../../config/Config";
import { LocalValue } from "../../../cfw/local";
import User from "../../user/User";
import { SheduleTimer, TimeManager, TimeHelper } from "../../../cfw/time";
import BagManager from "../../public/bag/BagManager";
import GameEventAdapter from "../../../extention/gevent/GameEventAdapter";
import { EventCheckType } from "../../../extention/gevent/GameEventConfig";
/**
* %SheetName%
**/

export default class ItemMgr extends BaseModel {

	protected itemModelMgr: ModelManager<ItemModel> = new ModelManager()


	protected buyEnergyDay: LocalValue;
	protected buyEnergyCount: LocalValue;
	protected time: number = ENERGY_TIME;
	protected timeout: LocalValue;
	protected timeObserver: SheduleTimer = new SheduleTimer(() => {
		this.time--;
		GEvent.instance().emit(EventName.UPDATE_ENERGY_TIMER, this.time)
		if (this.time <= 0) {
			this.time = ENERGY_TIME;
			this.addEnergy(1)
			if (this.timeout) {
				this.timeout.setValue(Date.now())
			}
		}

	}, 1)
	initData() {
		this.timeout = new LocalValue('ItemMgrtimeout', Date.now())
		TimeManager.instance().add(this.timeObserver)
		this.buyEnergyDay = new LocalValue('ItemMgrBuyEnergyDay', 1)
		this.buyEnergyCount = new LocalValue('ItemMgrvbuyEnergyCount', 0)
		this.itemModelMgr.initWithData(ModuleManager.dataManager.get(ItemModel.CLASS_NAME), ItemModel)
		if (this.buyEnergyDay.getInt() != User.instance().getLoginDayNum()) {
			this.buyEnergyDay.setValue(User.instance().getLoginDayNum())
			this.buyEnergyCount.setValue(0)
		}
		let now = Date.now();
		let pre = this.timeout.getInt();
		let sub = now - pre;
		let s = Math.ceil(sub / 1000)
		// console.log(' s ================= s', s)
		let c = Math.ceil(s / ENERGY_TIME)
		if (c > 0) {
			if (c > 100) {
				c = 100;
			}
			//this.addEnergy(c)
		}
		this.timeout.setValue(now)
	}

	addEnergy(c: number) {
		let m = this.getItemModel(ItemID.ENERGY)
		if (m) {
			let num = m.getNum()
			let nexNum = c + num;
			if (nexNum > ENERGY_MAX) {
				c = ENERGY_MAX - num;
			}
			if (c > 0) {
				this.updateCount(ItemID.ENERGY, c)
			}

		}
	}

	getNewItemModel(id, num) {
		let model = this.itemModelMgr.getNewModel(id, ItemModel)
		model.setNum(num, false)
		return model;
	}

	getItemModel(id) { return this.itemModelMgr.getByID(id) }

	getItemModelList() { return this.itemModelMgr.getList() }

	updateCount(id: number, value: number, p?: cc.Vec2, obj?: cc.Sprite) {
		let m: ItemModel = this.getItemModel(id)
		if (!m) {
			console.warn('ItemMgr updateCount id  ', id, value)
			return
		}
		m.setNum(m.getNum() + value)
		GEvent.instance().emit(EventName.UPDATE_ITEM_NUM, m, p, obj)
		// if (id == ItemID.ENERGY) {
		// 	GameEventAdapter.instance().checkEvent(EventCheckType.ENERGY, m.getNum())
		// }
	}

	// setCount(id: number, value: number) {
	// 	let m: ItemModel = this.getItemModel(id)
	// 	m.setNum(value)
	// 	GEvent.instance().emit(EventName.UPDATE_ITEM_NUM, m)
	// }

	getCount(id: number) {
		let item: ItemModel = this.getItemModel(id)
		return item.getNum()
	}

	isEnough(id: number, value: number) {
		let item: ItemModel = this.getItemModel(id)
		return item.getNum() >= value;
	}

	updateBuyEnergyCount() {
		this.buyEnergyCount.updateValue(1)
	}

	getBuyEnergyCount() {
		return this.buyEnergyCount.getInt();
	}

	getBuyEnergyCost() {
		// 10 20,40,80 160 
		let count = this.getBuyEnergyCount();
		let n = Math.pow(2, count)
		return n * 10
	}


	// getGold(): number {
	// 	return this.getCount(ItemID.GOLD)
	// }

	// updateGold(v: number): void {
	// 	this.updateCount(ItemID.GOLD, v)
	// }

	// isGoldEnough(v: number): boolean {
	// 	return this.isEnough(ItemID.GOLD, v)
	// }

}