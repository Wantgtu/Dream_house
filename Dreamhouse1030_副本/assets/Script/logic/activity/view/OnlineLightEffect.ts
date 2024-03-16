import { GEvent } from "../../../cfw/event";
import { EventName } from "../../../config/Config";
import { BaseItemView } from "../../../cfw/view";
import Rotation360 from "../../../cocos/comp/Rotation360";
const { ccclass, property } = cc._decorator;

@ccclass
export default class OnlineLightEffect extends BaseItemView {

    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    constructor() { super(); }

    onEnable(): void {
    }

    onDisable(): void {
    }

    onEnter() {
        this.setVisible(false)
        GEvent.instance().on(EventName.ONLINE_LIGHT_EFFECT, this.updateState, this)
    }

    updateState(flag) {
        let view = this.node
        this.setVisible(flag)
        if (flag) {
            let comp = view.getComponent(Rotation360)
            if (!comp) {
                view.addComponent(Rotation360)
            }

        } else {

        }
    }

    onDestroy() {
        GEvent.instance().off(EventName.ONLINE_LIGHT_EFFECT, this.updateState, this)
    }
}