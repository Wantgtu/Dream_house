import CMgr from "../../sdk/channel-ts/CMgr";

// import SDKManager from "../../sdk/SDKManager";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onLoad() {

        let num = CMgr.helper.getClick_award_video();

        if (CMgr.helper.isSwtichOpen() && num > 0) {
            cc.tween(this.node).delay(num).call(() => {
                CMgr.helper.showRewardAd(0, () => {

                })
            }).start();
        }
    }

    // update (dt) {}
}
