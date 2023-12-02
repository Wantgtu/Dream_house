import CMgr from "../../../sdk/channel-ts/CMgr";
import ActivityC from "../ActivityC";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class OnlineButton extends cc.Component {



    start() {
        this.node.active = CMgr.helper.hasOnline();
    }

    onButtonClick() {
        ActivityC.instance().showOnlineView()
    }

    // update (dt) {}
}
