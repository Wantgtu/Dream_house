import { BaseView } from "../../../cfw/view";
import SpecialtaskMgr from "../model/SpecialtaskMgr";
import { ItemState } from "../../../cfw/model";
import { EventName } from "../../../config/Config";
import SpecialTaskC from "../SpecialTaskC";
import { TimeDisplay } from "../../../cfw/time";
import { engine } from "../../../engine/engine";
import SpecialTaskItemView from "./SpecialTaskItemView";
import { ModuleID } from "../../../config/ModuleConfig";


const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialTaskView extends BaseView {

	@property({ type: cc.Sprite, displayName: "progressNodeSprite" })
	progressNodeSprite: cc.Sprite = null;

	@property({ type: cc.Sprite, displayName: "ProgressBarSprite" })
	ProgressBarSprite: cc.Sprite = null;

	@property({ type: cc.ProgressBar, displayName: "ProgressBarProgressBar" })
	ProgressBarProgressBar: cc.ProgressBar = null;

	@property({ type: cc.Label, displayName: "progressLabelLabel" })
	progressLabelLabel: cc.Label = null;

	@property({ type: cc.Sprite, displayName: "itemIconSprite" })
	itemIconSprite: cc.Sprite = null;

	@property({ type: cc.Sprite, displayName: "ProgressBar2Sprite" })
	ProgressBar2Sprite: cc.Sprite = null;

	@property({ type: cc.ProgressBar, displayName: "ProgressBar2ProgressBar" })
	ProgressBar2ProgressBar: cc.ProgressBar = null;

	@property({ type: cc.Sprite, displayName: "comingsoonSprite" })
	comingsoonSprite: cc.Sprite = null;

	@property({ type: cc.Label, displayName: "comingsoonTextLabel" })
	comingsoonTextLabel: cc.Label = null;

	@property({ type: cc.Sprite, displayName: "title1Sprite" })
	title1Sprite: cc.Sprite = null;

	@property({ type: cc.Sprite, displayName: "backBtnSprite" })
	backBtnSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "backBtnButton" })
	backBtnButton: cc.Button = null;

	@property({ type: cc.Sprite, displayName: "play_smallSprite" })
	play_smallSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "play_smallButton" })
	play_smallButton: cc.Button = null;

	@property({ type: cc.Label, displayName: "timeLabelLabel" })
	timeLabelLabel: cc.Label = null;

	@property({ type: cc.Sprite, displayName: "timeLayerSprite" })
	timeLayerSprite: cc.Sprite = null;

	@property({ type: cc.Label, displayName: "dayTimeLabelLabel" })
	dayTimeLabelLabel: cc.Label = null;

	@property({ type: cc.Sprite, displayName: "title2Sprite" })
	title2Sprite: cc.Sprite = null;

	@property(cc.Prefab)
	prefab: cc.Prefab = null;

	@property(cc.Layout)
	layout: cc.Layout = null;


	protected model: SpecialtaskMgr;
	protected controller: SpecialTaskC;
	onEnter() {
		this.model.checkTime();

		this.gEventProxy.on(EventName.UPDATE_SPECIAL_TASK_STEP, this.updateProgress, this)
		this.gEventProxy.on(EventName.UPDATE_SPECIAL_GOLD_NUM, this.updateGoldNum, this)
		this.gEventProxy.on(EventName.CHANGE_SPECIAL_TASK_STATE, this.updateState, this)
		this.gEventProxy.on(EventName.UPDATE_SPECIAL_TASK_TIME, this.updateTime, this)
		this.gEventProxy.on(EventName.CLOSE_GAME_VIEW, this.hide, this)
		let array = this.model.getSpecialTaskItemModelList();
		for (let index = 0; index < array.length; index++) {
			const element = array[index];
			let node: cc.Node = engine.instantiate(this.prefab)
			let item = node.getComponent(SpecialTaskItemView)
			if (item) {
				item.setModel(element)
				this.layout.node.addChild(node)
			}
		}
		this.content();
	}
	updateTime(time: number) {
		this.dayTimeLabelLabel.string = TimeDisplay.getFontString(time)
	}

	content() {
		this.updateGoldNum();
		this.updateState();
		this.updateProgress()
		this.updateTime(this.model.getLeftTime())
	}


	updateState() {
		let state = this.model.getState();
		console.log('SpecialTaskView updateState state ', state)
		switch (parseInt('' + state)) {
			case ItemState.NOT_GET:
				this.title1Sprite.node.active = false
				this.ProgressBar2Sprite.node.active = false
				this.title2Sprite.node.active = true;
				this.play_smallButton.node.active = false;
				this.comingsoonSprite.node.active = true;
				this.progressNodeSprite.node.active = false
				break;
			case ItemState.ON_GOING:
				this.ProgressBar2Sprite.node.active = true
				this.title1Sprite.node.active = true
				this.title2Sprite.node.active = false;
				this.play_smallButton.node.active = true;
				this.comingsoonSprite.node.active = false;
				this.progressNodeSprite.node.active = true
				break;
		}
	}

	updateGoldNum() {
		let cur = this.model.getCurModel();
		this.ProgressBarProgressBar.progress = this.model.getGoldNum() / cur.getGold();
		this.progressLabelLabel.string = this.model.getGoldNum() + '/' + cur.getGold();
	}

	updateProgress() {
		let step = this.model.getStep() + 1;
		this.ProgressBar2ProgressBar.progress = step / this.model.getSize();
		let cur = this.model.getCurModel();
		if (cur) {
			this.setSpriteAtlas(this.itemIconSprite, cur.getModuleID(), cur.getIcon(), cur.getSpriteFrame())
		}
	}

	onbackBtnButtonClick() {
		this.hide();
	}

	onplay_smallButtonClick() {
		this.hide();
		this.controller.playGame()
	}



}