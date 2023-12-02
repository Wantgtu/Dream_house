import { BaseView } from "../../../cfw/view";
import LobbyC from "../LobbyC";
import GuideMgr from "../../../extention/guide/GuideMgr";
import { EventName } from "../../../config/Config";
import BuildItemModel from "../../scene/model/BuildItemModel";
import { GEvent } from "../../../cfw/event";
import ButtonDuration from "../../../cfw/widget/ButtonDuration";


const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyView extends BaseView {

	@property({ type: cc.Node, displayName: "contentNode" })
	contentNode: cc.Node = null;

	@property({ type: cc.Sprite, displayName: "playBtnSprite" })
	playBtnSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "playBtnButton" })
	playBtnButton: cc.Button = null;

	@property({ type: cc.Sprite, displayName: "taskBtnSprite" })
	taskBtnSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "taskBtnButton" })
	taskBtnButton: cc.Button = null;

	protected leftD: ButtonDuration = new ButtonDuration();
	protected rightD: ButtonDuration = new ButtonDuration();
	protected controller: LobbyC;
	onLoad() {
		this.controller.addScene(this.contentNode, this.controller.getCurID(), () => {
			this.controller.init();
		})
		// this.gEventProxy.on(EventName.NEW_BUILD_OPEN, this.newBuildOpen, this)
		this.gEventProxy.on(EventName.CLOSE_GAME_VIEW, this.newBuildOpen, this)
	}

	newBuildOpen(m: BuildItemModel) {
		if (m.getType() != this.controller.getCurID()) {
			this.controller.addScene(this.contentNode, m.getType())
		}
	}

	changeContent() {
		let child = this.contentNode.children[0]
		if (child) {
			child.destroy();
		}
		this.controller.addScene(this.contentNode, this.controller.getCurID())
	}




	onDestroy() {

	}

	onplayBtnButtonClick() {
		GuideMgr.instance().notify('LobbyView_onplayBtnButtonClick')
		this.controller.intoGame()

	}

	ontaskBtnButtonClick() {
		this.controller.intoTask();
	}


	onLeftClick() {
		if (this.leftD.canClick()) {
			this.controller.leftScene();
			this.changeContent()
		}

	}

	onRightClick() {
		if (this.rightD.canClick()) {
			this.controller.rightScene()
			this.changeContent()
		}
	}



}