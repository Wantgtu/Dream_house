
import ButtonSoundComp from "../../../cocos/comp/ButtonSoundComp"
import { BaseItemView } from "../../../cfw/view";
import IRadioButton from "../../../cfw/widget/IRadioButton";
import FoodItemModel from "../model/FoodItemModel";
import GameC from "../GameC";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectFoodItemView extends BaseItemView implements IRadioButton {

	@property({ type: cc.Sprite, displayName: "tipBtnSprite" })
	tipBtnSprite: cc.Sprite = null;

	@property({ type: cc.Button, displayName: "tipBtnButton" })
	tipBtnButton: cc.Button = null;

	@property({ type: ButtonSoundComp, displayName: "tipBtnButtonSoundComp" })
	tipBtnButtonSoundComp: ButtonSoundComp = null;

	@property({ type: cc.Sprite, displayName: "foodIconSprite" })
	foodIconSprite: cc.Sprite = null;

	@property({ type: cc.Sprite, displayName: "pointSprite" })
	pointSprite: cc.Sprite = null;


	protected model: FoodItemModel;
	onEnter() {
		this.setRadioButtonState(false)
		if (this.model)
			this.setSpriteAtlas(this.foodIconSprite, this.model.getModuleID(), this.model.getIcon(), this.model.getSpriteFrame())
	}






	ontipBtnButtonClick() {
		if (this.model)
			GameC.instance().showFoodInfo(this.model)
	}

	onButtonClick() {
		if (this.model)
			GameC.instance().clickSelectFood(this)
	}


	setRadioButtonState(flag: boolean) {
		this.pointSprite.node.active = flag;
	}



}