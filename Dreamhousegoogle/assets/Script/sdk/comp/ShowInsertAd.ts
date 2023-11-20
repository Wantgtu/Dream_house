import SDKManager from "../sdk/SDKManager";
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
export default class ShowInsertAd extends cc.Component {

    static count: number = 0;

    @property
    adIndex: number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        // if (ShowInsertAd.count++ % 2 == 0) {
        if (GameEventAdapter.instance().isOpen()) {
            return;
        }
        CMgr.helper.showFuncInsertAd(this.adIndex)
        // }

    }

    onDestroy() {
        if (GameEventAdapter.instance().isOpen()) {
            return;
        }
        CMgr.helper.hideFuncInsertAd(this.adIndex)
    }

    // update (dt) {}
}
