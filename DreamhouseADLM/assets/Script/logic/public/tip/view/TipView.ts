import TipModel from "../model/TipModel";
import { BaseView } from "../../../../cfw/view";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TipView extends BaseView {

	@property(cc.Label)
	back$VButton: cc.Label = null;

	@property(cc.Label)
	conform$VButton: cc.Label = null;

	@property(cc.Label)
	content$VLabel: cc.Label = null;

	@property(cc.Sprite)
	adSprite: cc.Sprite = null;
	@property(cc.Sprite)
	moneySprite: cc.Sprite = null;


	protected model: TipModel;

	onEnter() {
		this.content$VLabel.string = this.model.text;
		// this.registerButtonByNode(this.conform$VButton, this.onconform$VButtonClick)
		// this.registerButtonByNode(this.back$VButton, this.onback$VButtonClick)
		if (this.model.rightStr && this.conform$VButton) {
			this.conform$VButton.string = this.model.rightStr;
		}

		if (this.model.leftStr && this.back$VButton) {
			this.back$VButton.string = this.model.leftStr;
		}

		this.adSprite.node.active = this.model.isShowAd;
		this.moneySprite.node.active = this.model.isShowAd
	}



	onback$VButtonClick() {
		this.hide()
		this.model.callback(0)
	}

	onconform$VButtonClick() {
		this.hide()
		this.model.callback(1)
	}



}