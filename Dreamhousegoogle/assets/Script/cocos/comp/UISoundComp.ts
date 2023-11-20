import SoundMgr from "../../logic/sound/model/SoundMgr";
import { SoundID } from "../../config/Config";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class UISoundComp extends cc.Component {


    onLoad() {
        SoundMgr.instance().playSound(SoundID.sfx_windowOpen)
    }

    onDestroy() {
        SoundMgr.instance().playSound(SoundID.sfx_windowClose)
    }

    // update (dt) {}
}
