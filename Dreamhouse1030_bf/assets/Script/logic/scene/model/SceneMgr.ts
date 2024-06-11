import { BaseModel, ModelManager, ItemState } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import BuildItemModel, { BuildItemModelEnum } from "./BuildItemModel";
import SceneItemModel, { SceneItemModelEnum } from "./SceneItemModel";
import { RedTipType } from "../../../config/Config";
import { LocalValue } from "../../../cfw/local";
import RedTipMgr from "../../../extention/redtip/RedTipMgr";
/**
* %SheetName%
**/
export default class SceneMgr extends BaseModel {

	protected buildItemModelMgr: ModelManager<BuildItemModel> = new ModelManager()
	protected sceneItemModelMgr: ModelManager<SceneItemModel> = new ModelManager()

	protected sceneID: LocalValue;
	initData() {
		this.sceneID = new LocalValue('SceneID', 1)
		let data = ModuleManager.dataManager.get(SceneItemModel.CLASS_NAME)
		// console.log('SceneMgr data ', data)
		this.buildItemModelMgr.initWithData(ModuleManager.dataManager.get(BuildItemModel.CLASS_NAME), BuildItemModel)
		this.sceneItemModelMgr.initWithData(ModuleManager.dataManager.get(SceneItemModel.CLASS_NAME), SceneItemModel)


		let list = this.buildItemModelMgr.getList();
		for (let index = 0; index < list.length; index++) {
			const element = list[index];
			if (element.getState() == ItemState.CAN_GET) {
				RedTipMgr.instance().addRedTip(RedTipType.BUILD_OPEN, element.getID())
			}
		}
	}
	left() {
		let id = this.sceneID.getInt();
		id = id + 1
		let len = SceneMgr.instance().getSceneItemModelList().length
		if (id > len) {
			id = 1
		}
		this.sceneID.setValue(id)
	}
	getCurID() {
		return this.sceneID.getInt()
	}
	right() {
		let len = SceneMgr.instance().getSceneItemModelList().length
		let id = this.sceneID.getInt();
		id = id - 1
		if (id < 1) {
			id = len
		}
		this.sceneID.setValue(id)

	}

	setSceneID(id: number) {
		this.sceneID.setValue(id)
	}
	getBuildItemModel(id) { return this.buildItemModelMgr.getByID(id) }

	getBuildItemModelList() { return this.buildItemModelMgr.getList() }

	getSceneItemModel(id) { return this.sceneItemModelMgr.getByID(id) }

	getSceneItemModelList() { return this.sceneItemModelMgr.getList() }



	getBuildIndexData(sceneID: number) {
		return this.buildItemModelMgr.getIndexData(BuildItemModelEnum.type, sceneID)
	}

	// setBuildState(buildID: number, gold: number) {
	// 	let build = this.getBuildItemModel(buildID)
	// 	if (build && build.getState() == ItemState.NOT_GET) {
	// 		build.setCoin(build.getCoin() + gold)
	// 		if (build.getCoin() >= TaskMgr.instance().getTotalCoin(build.getID())) {
	// 			build.setState(ItemState.CAN_GET)
	// 			GEvent.instance().emit(EventName.CHANGE_BUILD_STATE,build)
	// 		}
	// 	}
	// }


	hasBuildNotOpen(build: BuildItemModel) {
		let list = this.getBuildIndexData(build.getType())
		if (list) {
			for (let index = 0; index < list.length; index++) {
				const element = list[index];
				if (element.getState() == ItemState.CAN_GET) {
					return true
				}
			}
		}
		return false;
	}
}