import { BaseItemView } from "../../../cfw/view";
import { BaseItemModel } from "../../../cfw/model";
import { ModuleID } from "../../../config/ModuleConfig";
import { ModuleManager } from "../../../cfw/module";
import { ResType, ResItem } from "../../../cfw/res";


const { ccclass, property } = cc._decorator;

@ccclass
export default class MarketFoodItemView extends BaseItemView {

	@property({ type: cc.Sprite, displayName: "iconSprite" })
	iconSprite: cc.Sprite = null;

	@property({ type: cc.Label, displayName: "numLabel" })
	numLabel: cc.Label = null;


	protected model: BaseItemModel;
	onLoad() {
	}

	content() {
		this.setSpriteAtlas(this.iconSprite, this.model.getModuleID(), this.model.getIcon(), this.model.getSpriteFrame())
		this.numLabel.string = '' + this.model.getNum(false)
	}


	onDestroy() {

	}

	onButtonClick() {

	}

}