import CMgr from "../channel-ts/CMgr";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class VersionLabel extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;



    start() {
        this.label.string = 'V_' + CMgr.helper.getVersion();
    }

    // update (dt) {}
}
