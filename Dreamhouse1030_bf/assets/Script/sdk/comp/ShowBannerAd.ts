import { SDKDir } from "../sdk/SDKConfig";
import SDKManager from "../sdk/SDKManager";
import CMgr from "../channel-ts/CMgr";
import { GEvent } from "../../cfw/event";
import InsertAdMgr from "./InsertAdMgr";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class ShowBannerAd extends cc.Component {
    static count: number = -1;
    @property
    adIndex: number = 0;

    @property({ type: cc.Enum(SDKDir) })
    dir: SDKDir = SDKDir.BOTTOM_MID
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    protected myCount: number = 0;
    start() {
        // ShowBannerAd.count++
        // this.myCount = ShowBannerAd.count
        GEvent.instance().on(InsertAdMgr.OPEN_NATIVE_AD, this.hide, this)
        GEvent.instance().on(InsertAdMgr.CLOSE_NATIVE_AD, this.show, this)

        this.show();

    }
    show() {
        if (InsertAdMgr.isBannerState()) {
            CMgr.helper.showBannerAd(this.adIndex, this.dir)
        }
    }

    onDestroy() {
        // if (this.myCount % 2 == 0) {
        // SDKManager.getChannel().hideBanner(this.adIndex)

        GEvent.instance().off(InsertAdMgr.CLOSE_NATIVE_AD, this.show, this)
        GEvent.instance().off(InsertAdMgr.OPEN_NATIVE_AD, this.hide, this)
        // } else {
        //     SDKManager.getChannel().hideCustomAd(1)
        // }
        this.hide()
    }

    hide() {
        CMgr.helper.hideBannerAd(this.adIndex)
    }

    // update (dt) {}
}
