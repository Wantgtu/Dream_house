import PrivacyC from "../PrivacyC";
import CMgr from "../../channel-ts/CMgr";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PrivacyButton extends cc.Component {

    @property(cc.Button)
    backBtn: cc.Button = null;
    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    constructor() { super(); }

    onEnable(): void {
    }

    onDisable(): void {
    }

    onLoad() {
        let flag = CMgr.helper.hasSinglePrivicy();
        this.backBtn.node.active = flag

    }

    onBackBtnClick() {
        PrivacyC.instance().intoLayer()
    }
}