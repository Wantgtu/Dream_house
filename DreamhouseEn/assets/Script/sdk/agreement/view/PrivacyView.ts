


import { BaseView } from "../../../cfw/view";
import SDKManager from "../../sdk/SDKManager";
import PrivacyMgr from "../PrivacyMgr";
import PrivacyC from "../PrivacyC";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PrivacyView extends BaseView {
    @property(cc.Button)
    cancel: cc.Button = null;

    @property(cc.Button)
    ok: cc.Button = null;

    @property(cc.Button)
    useBtn: cc.Button = null;

    @property(cc.Button)
    yinsiBtn: cc.Button = null;
    // 更多参数说明请访问: https://ldc2.ccbox.com/doc/?nav=zh-as-2-4-0

    protected model: PrivacyMgr;
    protected controller: PrivacyC;

    constructor() {
        super();

    }

    onEnter(): void {
        console.log(' PrivacyView ')
        // this.cancel.clickHandler = cc.Handler.create(this, this.onCancelClick)
        // this.ok.clickHandler = cc.Handler.create(this, this.onOkClick)
        // this.useBtn.clickHandler = cc.Handler.create(this, this.onUserBtn, null, false)
        // this.yinsiBtn.clickHandler = cc.Handler.create(this, this.onYinsiBtn, null, false)
    }

    onCancelClick() {
        console.log(' onCancelClick')
        SDKManager.getChannel().exitApplication()
    }

    onDisable(): void {
    }

    onUserBtn() {
        // PrivacyPopView.OpenView(PrivacyContent)
        this.controller.openAgreementView()
    }

    onYinsiBtn() {
        // PrivacyPopView.OpenView(YinsiContent)
        this.controller.openEmailView()
    }

    onOkClick() {
        console.log(' onOKClick')
        this.hide()

        this.controller.ok();
        // if (PrivacyView.func) {
        //     PrivacyView.func()
        // }

    }

    // protected static func: Function;
    // static OpenView(func: Function) {
    //     this.func = func;
    //     let v = cc.LocalStorage.getItem(KEY)
    //     if (v != '1') {
    //         window['ML'].cc.OpenScene("view/PrivacyView.scene")
    //     } else {
    //         func()
    //     }

    // }
}