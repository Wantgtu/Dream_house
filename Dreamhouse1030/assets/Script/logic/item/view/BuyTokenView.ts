import { BaseView } from "../../../cfw/view";
import ItemC from "../ItemC";
import BuyTokenModel from "../model/BuyTokenModel";


const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyTokenView extends BaseView {

	@property({ type: cc.Sprite, displayName: "play_smallSprite" })
	play_smallSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "play_smallButton" })
	play_smallButton: cc.Button = null;

	@property({ type: cc.Label, displayName: "levelLabel" })
	levelLabel: cc.Label = null;

	@property({ type: cc.Button, displayName: "backBtnButton" })
	backBtnButton: cc.Button = null;

	protected model: BuyTokenModel

	protected controller: ItemC;

	onLoad() {
		this.levelLabel.string = '' + this.model.getNum();
	}




	onDestroy() {

	}

	onplay_smallButtonClick() {
		if (this.controller) {
			this.hide()
			this.controller.openStoreView()
		}
	}

	onbackBtnButtonClick() {
		this.hide();
	}

	onPlayAdButtonClick() {
		this.controller.buyToken(this)
	}



}