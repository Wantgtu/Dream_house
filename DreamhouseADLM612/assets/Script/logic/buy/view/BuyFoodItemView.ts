import { BaseItemView } from "../../../cfw/view";
import { BaseItemModel, ItemState } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import { ResType, ResItem } from "../../../cfw/res";
import BuyC from "../BuyC";
import FoodItemModel from "../../game/model/FoodItemModel";
import { CCPoolManager } from "../../../cocos/ccpool";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyFoodItemView extends BaseItemView {

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    protected model: FoodItemModel;

    content() {

        this.setSpriteAtlas(this.icon, this.model.getModuleID(), this.model.getIcon(), this.model.getSpriteFrame())
        this.icon.node.scale = this.model.getScale() / 2;
        // this.updateState();
        // this.eventProxy.on(BaseItemModel.UPDATE_STATE, this.updateState, this)
    }

    getFoodID() {
        return this.model.getID();
    }

    // updateState() {
    //     if (this.model.getState() == ItemState.GOT) {
    //         this.bg.node.active = true;
    //     } else {
    //         this.bg.node.active = false;
    //     }
    // }

    recover() {
        CCPoolManager.instance().put(this.node)
    }

    onButtonClick() {
        BuyC.instance().showFoodInfo(this.model)
    }

    setBgVisible(f: boolean) {
        this.bg.node.opacity = f ? 255 : 0
    }

    // update (dt) {}
}
