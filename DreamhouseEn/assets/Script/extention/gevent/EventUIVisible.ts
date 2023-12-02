import GameEventAdapter from "./GameEventAdapter";
import { GameEventName } from "./GameEventConfig";
import { GEvent } from "../../cfw/event";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class EventUIVisible extends cc.Component {

    @property
    id: number = -1;
    start() {
        GEvent.instance().on(GameEventName.EVENT_UI_VISIBLE, this.updateState, this)
    }

    onDestroy() {
        GEvent.instance().off(GameEventName.EVENT_UI_VISIBLE, this.updateState, this)
    }

    updateState(id: number, flag: boolean) {
        if (this.id == id) {
            this.node.active = flag;
        }
    }

    // update (dt) {}
}
