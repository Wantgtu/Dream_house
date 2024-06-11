
import TaskItemModel from "../model/TaskItemModel";
import { BaseView } from "../../../cfw/view";
import TaskC from "../TaskC";
import { ItemState } from "../../../cfw/model";
import TaskPropItemView from "./TaskPropItemView";
import { CCPoolManager } from "../../../cocos/ccpool";
import GuideMgr from "../../../extention/guide/GuideMgr";
import TaskBuildProgress from "./TaskBuildProgress";
import TaskMgr from "../model/TaskMgr";
import BoxPopC from "../../boxpop/BoxPopC";
import { engine } from "../../../engine/engine";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TaskView extends BaseView {

	@property({ type: cc.Sprite, displayName: "LayoutSprite" })
	LayoutSprite: cc.Sprite = null;

	@property({ type: cc.Layout, displayName: "LayoutLayout" })
	LayoutLayout: cc.Layout = null;

	@property({ type: cc.Sprite, displayName: "ProgressBarSprite" })
	ProgressBarSprite: cc.Sprite = null;

	@property({ type: cc.ProgressBar, displayName: "ProgressBarProgressBar" })
	ProgressBarProgressBar: cc.ProgressBar = null;

	@property({ type: cc.Sprite, displayName: "playSprite" })
	playSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "playButton" })
	playButton: cc.Button = null;

	@property({ type: cc.Label, displayName: "percentLabel" })
	percentLabel: cc.Label = null;

	@property({ type: cc.Sprite, displayName: "backSprite" })
	backSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "backButton" })
	backButton: cc.Button = null;

	@property({ type: cc.Sprite, displayName: "play_smallSprite" })
	play_smallSprite: cc.Sprite = null;

	@property({ type: cc.Label, displayName: "costNumLabel" })
	costNumLabel: cc.Label = null;



	@property({ type: cc.Node, displayName: "Consoletableleg02" })
	Consoletableleg02: cc.Node = null;

	@property(cc.Prefab)
	propItemPrefab: cc.Prefab = null;

	@property(cc.Node)
	bottom: cc.Node = null;

	@property(cc.Prefab)
	buildProPrefab: cc.Prefab = null;

	protected controller: TaskC;
	protected model: TaskItemModel;

	protected items: TaskPropItemView[] = []
	protected buildProgress: TaskBuildProgress[] = []
	onLoad() {
		// console.log('TaskView this.model.getState() ', this.model.getState())
		switch (this.model.getState()) {
			case ItemState.ON_GOING:
			case ItemState.NOT_GET:
				this.play_smallSprite.node.active = false
				this.Consoletableleg02.active = true;
				this.ProgressBarProgressBar.progress = this.model.getProgress()
				let have = this.model.getHaveCount();
				let need = this.model.getGold();
				this.percentLabel.string = have + '/' + need
				break;
			case ItemState.CAN_GET:
				this.play_smallSprite.node.active = true
				this.Consoletableleg02.active = false;
				this.costNumLabel.string = this.model.getGold()
				break;

			// break;
		}
		// if (this.model.getState() == ItemState.ON_GOING) {


		// } else if (this.model.getState() == ItemState.CAN_GET) {

		// }

		let items = this.model.getItemList()
		for (let index = 0; index < items.length; index++) {
			const element = items[index];
			let node = CCPoolManager.instance().get('TaskPropItemView', () => {
				return cc.instantiate(this.propItemPrefab)
			})
			let comp = node.getComponent(TaskPropItemView)
			if (comp) {
				comp.setModel(element)
				comp.content();
				this.items.push(comp)
			}
			this.LayoutLayout.node.addChild(node)

		}

		let build = this.model.getBuildID();
		let list = TaskMgr.instance().getIndexData(build)
		for (let index = 0; index < list.length; index++) {
			const model = list[index];
			let node = engine.instantiate(this.buildProPrefab)
			if (node) {
				let comp: TaskBuildProgress = node.getComponent(TaskBuildProgress)
				if (comp) {
					this.buildProgress.push(comp)
					comp.setModel(model)
					comp.updateState();
					this.bottom.addChild(node)
				}
			}
		}
		// for (let index = 0; index < this.buildProgress.length; index++) {
		// 	const element = this.buildProgress[index];
		// 	if (element && list[index]) {
		// 		// console.log(' list[index] ',list[index].getID())
		// 		element.setModel(list[index])
		// 	}
		// }
	}


	recover() {
		for (let index = 0; index < this.items.length; index++) {
			const element = this.items[index];
			element.recover()
		}
	}


	onDestroy() {

	}

	onplayButtonClick() {
		this.recover();
		this.hide();

		this.controller.playGame();
	}

	onbackButtonClick() {
		this.recover();
		this.hide()
		BoxPopC.instance().intoLayer()
	}

	onGetTaskReward() {
		this.recover();
		this.hide();
		GuideMgr.instance().notify('onRewaardBtnClick')
		let pos = this.play_smallSprite.node.convertToWorldSpaceAR(this.play_smallSprite.node.getPosition())
		this.controller.getTaskReward(this.model, 1, pos)
	}



}