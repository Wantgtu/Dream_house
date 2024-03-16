import { SoundID } from "../../config/Config";
import SoundMgr from "../../logic/sound/model/SoundMgr";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ButtonSoundComp extends cc.Component {


    @property
    soundID: number = SoundID.sfx_buttonPress;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
    }

    touchEnd() {
        SoundMgr.instance().playSound(this.soundID)
    }

    // update (dt) {}
}
