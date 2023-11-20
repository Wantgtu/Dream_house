import { BaseItemView } from "../../../cfw/view";
import FoodItemModel from "../model/FoodItemModel";
import { CCPoolManager } from "../../../cocos/ccpool";


const { ccclass, property } = cc._decorator;

@ccclass
export default class FoodInfoItemView extends BaseItemView {

	@property({ type: cc.Sprite, displayName: "iconSprite" })
	iconSprite: cc.Sprite = null;

	@property({ type: cc.Sprite, displayName: "selectSprite" })
	selectSprite: cc.Sprite = null;

	@property({ type: cc.Label, displayName: "percent" })
	percent: cc.Label = null;

	protected model: FoodItemModel;

	content() {
		this.setSpriteAtlas(this.iconSprite, this.model.getModuleID(), this.model.getIcon(), this.model.getSpriteFrame())
		this.iconSprite.node.scale = this.model.getScale();
		this.node.y = 0;
	}

	recover() {
		CCPoolManager.instance().put(this.node)
	}




	onDestroy() {

	}



}