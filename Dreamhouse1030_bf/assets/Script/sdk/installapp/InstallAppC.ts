import { BaseController } from "../../cfw/mvc";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import InstallAppView from "./InstallAppView";
import { LocalValue } from "../../cfw/local";
import SDKManager from "../sdk/SDKManager";
import BagManager from "../../logic/public/bag/BagManager";
import { ItemID } from "../../config/Config";
import EngineHelper from "../../engine/EngineHelper";
import UIManager from "../../cfw/ui";
import CMgr from "../channel-ts/CMgr";
import GameEventAdapter from "../../extention/gevent/GameEventAdapter";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
let REWARD_NUM: number = 20;
export default class InstallAppC extends BaseController {



    protected count: LocalValue = new LocalValue('InstallApp_count', 0)

    intoLayer() {
        // if (UIManager.instance().hasView('InstallAppView', UIIndex.STACK)) {
        //     return
        // }
        if (!CMgr.helper.hasInstallApp()
            || !CMgr.helper.isVersion()
            || GameEventAdapter.instance().isOpen()) {
            return
        }

        let num = CMgr.helper.getzs_native_show_delay();
        console.log('InstallAppC  num ', num)
        if (num > 0) {
            setTimeout(() => {
                SDKManager.getChannel().canInstallShortcut((r: number) => {
                    if (r) {
                        this.showInstallAppView();
                    }
                })
            }, num);
        }

    }

    showInstallAppView() {
        ViewManager.pushUIView({
            path: "prefab/InstallAppView",
            moduleID: ModuleID.install,
            uiIndex: UIIndex.STACK,
            className: InstallAppView,
            controller: this,
            model: null,
            func: () => {
            }
        })
    }

    getCount() {
        return this.count.getInt();
    }

    getItemNum() {
        let r = REWARD_NUM - this.getCount()
        if (r <= 0) {
            r = 5
        }
        return r;
    }

    installApp() {
        // SDKManager.getChannel().canInstallShortcut((r: number) => {
        //     if (r) {
        SDKManager.getChannel().installShortcut((r: number) => {
            if (r) {
              
               
                let num = this.getItemNum();
                if (num > 0) {
                    BagManager.instance().updateItemNum(ItemID.TOKEN, num, EngineHelper.getMidPos())
                }
                this.count.updateValue(REWARD_NUM)
                UIManager.instance().popView()

            }
        })
        //     }
        // })

    }
}
