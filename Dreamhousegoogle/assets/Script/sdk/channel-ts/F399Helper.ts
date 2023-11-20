import BaseHelper from "./BaseHelper";
// import SDKEvent from "../sdk/tools/SDKEvent";
// import AudioMgr from "../../Script/public/audio/model/AudioMgr";
// import { SoundID } from "../../Script/public/config/Config";
//<script src="https://h.api.4399.com/h5mini-2.0/h5api-interface.php"></script>
export default class F399Helper extends BaseHelper {

    constructor() {
        super()
        // SDKEvent.instance().on(SDKEvent.REWARD_AD_CLOSE, this.rewardClose, this)
        // SDKEvent.instance().on(SDKEvent.REWARD_AD_OPEN, this.rewardOpen, this)
    }

    hasEmail() {
        return false;
    }

    isF399() {
        return true;
    }

    rewardOpen() {
        // AudioMgr.instance().stopMusic()
    }

    rewardClose() {
        // AudioMgr.instance().playMusic(SoundID.LKT_Gameplay_Soundtrack)
    }

    hasLight() {
        return true;
    }

    // hasAgreement() {
    //     return true;
    // }

    // hasSinglePrivicy() {
    //     return true;
    // }
}