import { DataModel } from "../../../cfw/cfw";
import ItemMgr from "../../item/model/ItemMgr";
import { ItemID, EventName, EXP_NUM } from "../../../config/Config";
import { BaseItemModel, ItemState } from "../../../cfw/model";
import BagManager from "../../public/bag/BagManager";
import { ModuleID } from "../../../config/ModuleConfig";
import { GEvent } from "../../../cfw/event";
import SceneMgr from "../../scene/model/SceneMgr";
import TaskMgr from "./TaskMgr";
import CMgr from "../../../sdk/channel-ts/CMgr";
import UmengEventID from "../../../config/UmengEventID";

export enum TaskItemModelEnum {
	gold,// 需要金额
	other,// 其他道具
	level,// 等级
	state,
	buildID,
	decorateID,
}

/**
* 任务表
**/
export default class TaskItemModel extends DataModel {

	static CLASS_NAME: string = 'TaskItemModel'
	protected items: BaseItemModel[] = []
	constructor() {
		super(TaskItemModel.CLASS_NAME)
	}
	// 需要金额
	getGold() {
		return this.getValue(TaskItemModelEnum.gold)
	}
	// 获得经验
	getExp() {
		return EXP_NUM
	}
	// 其他道具
	getOther() {
		return this.getValue(TaskItemModelEnum.other)
	}
	// 等级
	getLevel() {
		return this.getValue(TaskItemModelEnum.level)
	}

	getState() {
		return this.getValue(TaskItemModelEnum.state)
	}

	setState(s: number) {
		this.setValue(TaskItemModelEnum.state, s)
		GEvent.instance().emit(EventName.UPDATE_TASK_STATE)
		if (s == ItemState.GOT) {
			this.updateBuildState()
		}
		this.checkTaskState();
	}

	init(id, data) {
		super.init(id)
		this.checkTaskState();
	}

	checkTaskState() {
		if (this.getState() == ItemState.CAN_GET) {
			GEvent.instance().emit(EventName.TASK_OPEN, this.getID())
			// GameEventAdapter.instance().checkEvent(EventCheckType.TASK, this.getID())
		}
	}

	updateBuildState() {
		let build = this.getBuild()
		if (build) {
			if (build.getState() == ItemState.NOT_GET) {
				build.setState(ItemState.ON_GOING)
			}
			if (build.getState() != ItemState.GOT) {
				build.setCoin(build.getCoin() + this.getGold())
				if (build.getCoin() >= TaskMgr.instance().getTotalCoin(build.getID())) {
					build.setState(ItemState.CAN_GET)
					CMgr.helper.trackEvent(UmengEventID.build_open, { buildID: build.getID() })
				}
			}

		}
	}

	getBuild() {
		let build = this.getBuildID();
		// console.log('getBuild build ', build)
		return SceneMgr.instance().getBuildItemModel(build)
	}

	getDecorateID() {
		return this.getValue(TaskItemModelEnum.decorateID)
	}

	getBuildID() {
		return this.getValue(TaskItemModelEnum.buildID)
	}

	getHaveCount() {
		return ItemMgr.instance().getCount(ItemID.GOLD);
	}

	getProgress() {
		let have = this.getHaveCount()
		let need = this.getGold();
		let p = have / need;
		if (p > 1) {
			p = 1
		}
		return p;
	}


	getItemList() {
		if (this.items.length == 0) {
			this.items.push(BagManager.instance().getNewItemModel(ItemID.EXP, this.getExp()))
		}
		let other: number[] = this.getOther();
		if (!other) {
			return this.items;
		}
		if (other.length == 0) {
			return this.items;
		}

		if (this.items.length == 1 && other.length > 0) {
			let count = other.length / 2
			for (let index = 0; index < count; index++) {
				const id = other[index * 2];
				let num = other[index * 2 + 1]
				let m = BagManager.instance().getNewItemModel(id, num)
				if (m) {
					this.items.push(m)
				}
			}
		}
		return this.items;
	}

	getModuleID() {
		return ModuleID.PUBLIC;
	}


}