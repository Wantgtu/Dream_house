


import ToastModel from "../model/ToastModel";
import { BaseView } from "../../../../cfw/view";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ToastView extends BaseView {

	@property(cc.Sprite)
	bg$VSprite: cc.Sprite = null;


	@property(cc.Label)
	content$V: cc.Label = null;



	protected model: ToastModel;

	onEnter() {
		this.content$V.string = this.model.text;
		cc.tween(this.bg$VSprite.node).to(1, { y: this.bg$VSprite.node.y + 200 })
			.call(this.moveFinish.bind(this)).start();
	}

	moveFinish() {
		this.hide()
	}



}