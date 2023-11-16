import { BaseItemView } from "../../../cfw/view";
import GridFoodItemModel from "../../game/model/GridFoodItemModel";
import { ModuleManager } from "../../../cfw/module";
import { ModuleID } from "../../../config/ModuleConfig";
import { ResType, ResItem } from "../../../cfw/res";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyPropFoodItemView extends BaseItemView {
	@property(cc.Sprite)
	icon: cc.Sprite = null;

    protected model: GridFoodItemModel;
    start() {

    }

    content() {
        if (this.model) {
            this.setSpriteAtlas(this.icon, this.model.getModuleID(), this.model.getIcon(), this.model.getSpriteFrame())
        }
    }

    // update (dt) {}
}
