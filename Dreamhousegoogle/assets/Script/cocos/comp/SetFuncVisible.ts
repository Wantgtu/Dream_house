import { BaseView } from "../../cfw/view";
import { EventName } from "../../config/Config";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class SetFuncVisible extends BaseView {


    start() {
        this.gEventProxy.on(EventName.OPEN_MAKET, this.setShopNodeVisible, this)
    }

    setShopNodeVisible(f: boolean) {
        let v = f ? 255 : 0
        this.node.active = f;
    }

    // update (dt) {}
}
