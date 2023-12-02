import { BaseController } from "../../cfw/mvc";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import GiftBoxView from "./view/GiftBoxView";
import SDKManager from "../../sdk/sdk/SDKManager";
import { ItemID, VEDIO_ENERGY, VEDIO_TOKEN, } from "../../config/Config";
import BagManager from "../public/bag/BagManager";
import TipC from "../public/tip/TipC";
import CMgr from "../../sdk/channel-ts/CMgr";

import Utils from "../../cfw/tools/Utils";
import EngineHelper from "../../engine/EngineHelper";
import UmengEventID from "../../config/UmengEventID";
import TestConfig from "../../config/TestConfig";

export default class GiftBoxC extends BaseController {

    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    constructor() { super(); }

    onEnable(): void {
    }

    onDisable(): void {
    }

    intoLayer() {
        ViewManager.pushUIView({
            path: "giftbox/prefabs/GiftBoxView",
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.TOP,
            className: GiftBoxView,
            controller: this,
            model: null,
            func: () => {
            }
        })
    }

    addItem(pos) {
        // let pos = EngineHelper.getMidPos()
        // BagManager.instance().updateItemNum(ItemID.GOLD, VEDIO_GOLD, pos)
        let r = Utils.random(0, 100)
        if (r < 50) {
            BagManager.instance().updateItemNum(ItemID.ENERGY, VEDIO_ENERGY, pos)
        } else {
            BagManager.instance().updateItemNum(ItemID.TOKEN, VEDIO_TOKEN, pos)
        }
    }

    giftClick(pos) {
        CMgr.helper.trackEvent(UmengEventID.click_gift)
        CMgr.helper.showRewardAd(0, (r: number) => {
            if (TestConfig.GIFT_BOX) {
                TipC.instance().intoLayer("观看完毕才可获得金币奖励，是否继续观看?", (dir: number) => {
                    if (dir) {
                        CMgr.helper.trackEvent(UmengEventID.click_gift_2)
                        CMgr.helper.showRewardAd(0, (s) => {
                            if (s) {
                                this.addItem(pos);
                            }
                        })
                    }
                })
            } else {
                if (r) {
                    this.addItem(pos);
                } else {
                    TipC.instance().intoLayer("观看完毕才可获得金币奖励，是否继续观看?", (dir: number) => {
                        if (dir) {
                            CMgr.helper.trackEvent(UmengEventID.click_gift_2)
                            CMgr.helper.showRewardAd(0, (s) => {
                                if (s) {
                                    this.addItem(pos);
                                }
                            })
                        }
                    })
                }
            }

        })

    }
}