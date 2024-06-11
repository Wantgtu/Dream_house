import CMgr from "../channel-ts/CMgr";
import GameEventAdapter from "../../extention/gevent/GameEventAdapter";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShowPauseInsertAd extends cc.Component {
    @property
    adIndex: number = 0;


    start() {
        if (GameEventAdapter.instance().isOpen()) {
            return;
        }
        CMgr.helper.showInsertAd(this.adIndex)
    }
    onDestroy() {
        if (GameEventAdapter.instance().isOpen()) {
            return;
        }
        CMgr.helper.hideInsertAd(this.adIndex)
    }
    // update (dt) {}
}
