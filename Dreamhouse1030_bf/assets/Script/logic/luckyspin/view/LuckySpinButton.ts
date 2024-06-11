import CMgr from "../../../sdk/channel-ts/CMgr";
import LuckySpinC from "../LuckySpinC";
import { BaseItemView } from "../../../cfw/view";
import LuckyspinMgr from "../model/LuckyspinMgr";
import TipC from "../../public/tip/TipC";
import { LUCKY_SPIN_OPEN_LEVEL } from "../../../config/Config";
const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckySpinButton extends BaseItemView {

    @property(cc.Button)
    backBtn: cc.Button = null;
    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    constructor() { super(); }

    onEnable(): void {
    }

    onDisable(): void {
    }

    onEnter() {
        LuckyspinMgr.instance();
    }

    onBackBtnClick() {
        // LuckySpinC.instance().intoLayer()

        if (LuckyspinMgr.instance().isOpen()) {
            LuckySpinC.instance().intoLayer()
        } else {
            TipC.instance().showToast(LuckyspinMgr.instance().getTip())
        }
    }
}