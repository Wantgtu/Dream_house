import { BaseItemView } from "../../../cfw/view";
import { BaseItemModel } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import { ModuleID } from "../../../config/ModuleConfig";
import { ResType, ResItem } from "../../../cfw/res";
import { CCPoolManager } from "../../../cocos/ccpool";


const { ccclass, property } = cc._decorator;

@ccclass
export default class TaskPropItemView extends BaseItemView {



	@property({ type: cc.Sprite, displayName: "iconSprite" })
	iconSprite: cc.Sprite = null;

	@property({ type: cc.Label, displayName: "numLabelLabel" })
	numLabelLabel: cc.Label = null;
	protected model: BaseItemModel;
	onLoad() {

	}



	content() {
		this.numLabelLabel.string = '' + this.model.getNum(false)
		this.setSpriteAtlas(this.iconSprite, this.model.getModuleID(), this.model.getIcon(), this.model.getSpriteFrame())
		this.iconSprite.node.scale = this.model.getScale();
	}


	onDestroy() {

	}

	recover() {
		CCPoolManager.instance().put(this.node)
	}



}