import CMgr from "../../../sdk/channel-ts/CMgr";
import DailyTaskC from "../DailyTaskC";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyTaskButton extends cc.Component {



    // onLoad () {}

    start() {
        this.node.active = CMgr.helper.hasDailyTask();
    }

    onButtonClick() {
        DailyTaskC.instance().intoLayer()
    }

    // update (dt) {}
}
