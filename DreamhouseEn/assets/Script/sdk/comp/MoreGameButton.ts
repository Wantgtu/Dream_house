import CMgr from "../channel-ts/CMgr";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoreGameButton extends cc.Component {


    start() {
        let flag = CMgr.helper.hasMoreGame();
        this.node.active = flag;

        if (flag) {
            // this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
        }
    }

    touchEnd() {
        CMgr.helper.openMoreGameView(0, 0, 0.3);
    }
    // update (dt) {}
}
