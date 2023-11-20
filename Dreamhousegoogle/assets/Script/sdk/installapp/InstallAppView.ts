import { BaseView } from "../../cfw/view";
import InstallAppC from "./InstallAppC";
import { EventName } from "../../config/Config";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class InstallAppView extends BaseView {

    @property(cc.Label)
    label: cc.Label = null;


    start() {
        this.label.string = '+' + InstallAppC.instance().getItemNum();
        this.gEventProxy.on(EventName.CLOSE_GAME_VIEW, this.hide, this)
    }

    onInstallAppButtonLeftClick() {
        this.hide();
    }
    onInstallAppButtonRightClick() {
        InstallAppC.instance().installApp()
    }
    // update (dt) {}
}
