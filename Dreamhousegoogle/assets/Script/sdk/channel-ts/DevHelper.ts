import BaseHelper from "./BaseHelper";
import SDKEvent from "../sdk/tools/SDKEvent";
import Debug from "../../cfw/tools/Debug";
import SDKManager from "../sdk/SDKManager";

export default class DevHelper extends BaseHelper {

    constructor() {
        super()
        SDKEvent.instance().on(SDKEvent.REWARD_AD_CLOSE, this.rewardClose, this)
        SDKEvent.instance().on(SDKEvent.REWARD_AD_OPEN, this.rewardOpen, this)
        Debug.isDebug = false
    }

    rewardOpen() {
        // AudioMgr.instance().stopMusic()
    }

    rewardClose() {
        // AudioMgr.instance().playMusic(SoundID.LKT_Gameplay_Soundtrack)
    }
    hasAgreement() {
        return true;
    }
    hasLight() {
        return true;
    }


    isSwtichOpen() {
        return false;
    }

    getzs_video_box() {
        return 5;
    }

    getzs_box_switch() {
        return false;
    }

    getzs_box_show_delay() {
        return 1000;
    }

    isVersion() {
        return false;
    }

    hasInstallApp() {
        return false;
    }

    getzs_native_show_delay() {
        return 1000
    }
    marketHasType(type: number) {
        if (type == 4) {
            return SDKManager.getChannel().hasShare();
        }
        // if (type == 2 || type == 3) {
        //     return false
        // }
        return true;
    }

    canMultyAd() {
        return true;
    }
}