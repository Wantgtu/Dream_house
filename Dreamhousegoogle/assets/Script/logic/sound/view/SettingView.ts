import { BaseView } from "../../../cfw/view";
import SoundMgr from "../model/SoundMgr";
import TweenMgr from "../../../cocos/TweenMgr";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class SettingView extends BaseView {


    @property(cc.Node)
    right0: cc.Node = null;
    @property(cc.Node)
    right1: cc.Node = null;
    start() {
        this.updateMusicState();
        this.updateSoundState();
    }

    updateMusicState() {
        this.right0.active = SoundMgr.instance().getMusicFlag();
    }

    updateSoundState() {
        this.right1.active = SoundMgr.instance().getSoundFlag();
    }


    onTrogeClick(e, data: any) {

        // console.log('data', data)
        if (data == 0) {
            SoundMgr.instance().changeMusicsState();
            this.updateMusicState();
        } else {
            SoundMgr.instance().changeSoundState();
            this.updateSoundState();
        }
    }



    // update (dt) {}
}
