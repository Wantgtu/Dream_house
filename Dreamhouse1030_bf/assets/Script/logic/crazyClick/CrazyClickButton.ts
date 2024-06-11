import CrazyClickC from "./CrazyClickC";
import TweenMgr from "../../cocos/TweenMgr";
import LevelMgr from "../level/model/LevelMgr";
import TipC from "../public/tip/TipC";
import { EGG_OPEN_LEVEL } from "../../config/Config";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class CrazyClickButton extends cc.Component {


    @property(cc.Node)
    chuizi: cc.Node = null;

    start() {
        TweenMgr.showChuizi(this.chuizi, 0, 0.1)
        CrazyClickC.instance();

    }


    updateState() {

    }

    onCrazyClickButton() {
        if (CrazyClickC.instance().isOpen()) {
            CrazyClickC.instance().gotoLayer()
        } else {
            TipC.instance().showToast(CrazyClickC.instance().getTip())
        }

    }

    // update (dt) {}
}
