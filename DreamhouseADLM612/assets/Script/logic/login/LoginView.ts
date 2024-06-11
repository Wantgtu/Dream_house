import { BaseView } from "../../cfw/view";
import LobbyC from "../lobby/LobbyC";
import SDKManager from "../../sdk/sdk/SDKManager";
import { BaseStorage } from "../../cfw/storage";
import PrivacyC from "../../sdk/agreement/PrivacyC";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoginView extends BaseView {



    start() {
        PrivacyC.instance().intoLayer(() => {
            SDKManager.getChannel().showUserAgreement((s: number) => {
                console.log("NativeTest showUserAgreement s ", s)
                SDKManager.getChannel().initAd()
            })
        })
    }

    onButtonClick() {
        SDKManager.getChannel().login(BaseStorage.LOCAL_NAME, (r: number) => {
            if (r) {
                LobbyC.instance().intoLayer()
            }
        })
        // SDKManager.getChannel().showUserAgreement((s: number) => {
        //     if (s) {

        //     }
        // })


    }

    // update (dt) {}
}
