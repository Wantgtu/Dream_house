import PrivacyC from "../PrivacyC";
import CMgr from "../../channel-ts/CMgr";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PrivacyItemView extends cc.Component {

    @property
    public intType: number = 0;
    @property(cc.Button)
    useBtn: cc.Button = null;

    @property
    public text: string = '';
    // 更多参数说明请访问: https://ldc2.ccbox.com/doc/?nav=zh-as-2-4-0

    constructor() { super(); }

    onEnable(): void {
    }

    onDisable(): void {
    }

    onLoad() {
        let flag = CMgr.helper.hasSinglePrivicy();
        this.node.active = flag;


    }

    onButtonClick() {
        switch (this.intType) {
            case 0:
                PrivacyC.instance().openAgreementView()
                break;
            case 1:
                PrivacyC.instance().openEmailView()
                break;
        }
    }
}