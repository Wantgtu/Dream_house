import { DataModel } from "../../../cfw/cfw";
import { LocalList } from "../../../cfw/local";
import { EventName, RedTipType } from "../../../config/Config";
import { ItemState } from "../../../cfw/model";
import TaskMgr from "../../task/model/TaskMgr";
import { GEvent } from "../../../cfw/event";
import RedTipMgr from "../../../extention/redtip/RedTipMgr";
import SceneItemModel from "./SceneItemModel";
import SceneMgr from "./SceneMgr";
import { ModuleID } from "../../../config/ModuleConfig";


export enum BuildItemModelEnum {
	type,// 场景id
	index,// 顺序
	item,// 使用道具索引
	state,
	coin,
}

/**
* 建筑表
**/
export default class BuildItemModel extends DataModel {

	static CLASS_NAME: string = 'BuildItemModel'
	protected buildState: LocalList
	constructor() {
		super(BuildItemModel.CLASS_NAME)
	}
	// 场景id
	getType() {
		return this.getValue(BuildItemModelEnum.type)
	}
	// 顺序
	getIndex() {
		return this.getValue(BuildItemModelEnum.index)
	}
	// 使用道具索引
	getItem() {
		return this.getValue(BuildItemModelEnum.item)
	}

	setItem(n: number) {
		this.setValue(BuildItemModelEnum.item, n)
	}

	getState() {
		return this.getValue(BuildItemModelEnum.state)
	}

	setState(s: number) {
		this.setValue(BuildItemModelEnum.state, s)
		this.emit(EventName.UPDATE_BUILD_STATE)
		this.checkState();
	}

	init(id, data) {
		super.init(id, data)
		this.checkState();
	}

	checkState() {
		if (this.getState() == ItemState.CAN_GET) {
			RedTipMgr.instance().addRedTip(RedTipType.BUILD_OPEN, this.getID())
			// GameEventAdapter.instance().checkEvent(EventCheckType.BUILD, this.getID())
			GEvent.instance().emit(EventName.NEW_BUILD_OPEN, this)
			// GEvent.instance().emit(EventName.CHANGE_BUILD_STATE, this)
		}
	}

	setCoin(n: number) {
		this.setValue(BuildItemModelEnum.coin, n)
		this.emit(EventName.UPDATE_BUILD_COIN)
	}

	getCoin() {
		return this.getValue(BuildItemModelEnum.coin)
	}

	getTotalCoin() {
		return TaskMgr.instance().getTotalCoin(this.getID())
	}

	isClear() {
		let openCount = this.getOpenCount();
		let totalCount = this.getTotalCount()
		return openCount >= totalCount
	}

	getOpenCount() {
		return TaskMgr.instance().getOpenCount(this.getID())
	}

	getTotalCount() {
		return TaskMgr.instance().getTotalCount(this.getID())
	}

	getItemImage(n: number = 0) {
		let sceneID: number = this.getType();
		let root = 'texture/room_items_' + '0' + sceneID
		let idx = this.getIndex();
		let id = idx < 10 ? '0' + idx : idx;
		let index = '0' + n
		let path = root + '_' + id + '_' + index;
		return path;
	}

	getBuildState(n: number) {
		if (!this.buildState) {
			this.buildState = new LocalList('BuildItemModel' + this.ID, ItemState.NOT_GET)
			if (!this.buildState.isHaveData()) {
				this.buildState.set(0, ItemState.GOT)
			}
		}
		return this.buildState.get(n)
	}

	setBuildState(n: number, s: ItemState) {
		if (!this.buildState) {
			this.buildState = new LocalList('BuildItemModel' + this.ID, ItemState.NOT_GET)
		}
		this.buildState.set(n, s)
	}



	getSceneModel() {
		let scene: SceneItemModel = SceneMgr.instance().getSceneItemModel(this.getType())
		return scene;
	}

	getModuleID() {
		let scene = this.getSceneModel()
		if (scene) {
			return scene.getBundle()
		}
		return ModuleID.PUBLIC;
	}


}