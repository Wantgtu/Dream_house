import { GEvent } from "../../../cfw/event";
import { EventName } from "../../../config/Config";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneVisible extends cc.Component {


    @property
    className: string = ''

    start() {
        GEvent.instance().on(EventName.VIEW_SHOW, this.setVisible, this)
    }

    onDestroy() {
        GEvent.instance().off(EventName.VIEW_SHOW, this.setVisible, this)
    }

    setVisible(f: boolean, viewName: string) {

        if (this.className) {
            if (this.className == viewName) {
                // console.log('SceneVisible setVisible  ', f, viewName)
                this.node.opacity = f ? 0 : 255
            }
        }

    }

    // update (dt) {}
}
