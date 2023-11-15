import LevelMgr from "../model/LevelMgr";
import { BaseItemView } from "../../../cfw/view";
import { EventName } from "../../../config/Config";
import LevelC from "../LevelC";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class LevelComp extends BaseItemView {

    @property(cc.Label)
    lvLabel: cc.Label = null;


    start() {
        this.updateLv(true);
        this.gEventProxy.on(EventName.UPDATE_LEVEL, this.updateLv, this)
    }
    updateLv(isInit: boolean = false) {
        this.lvLabel.string = '' + LevelMgr.instance().getLevel()
        // this.updateExp();
        if (!isInit) {
            setTimeout(() => {
                // GEvent.instance().emit(EventName.UPDATE_LEVEL)
                LevelC.instance().intoLayer()
            }, 1000);
        }

    }
    // update (dt) {}
}
