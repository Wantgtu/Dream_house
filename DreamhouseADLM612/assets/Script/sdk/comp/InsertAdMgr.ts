import { GEvent } from "../../cfw/event";
import CMgr from "../channel-ts/CMgr";


export default class InsertAdMgr {
    static OPEN_NATIVE_AD: string = 'OPEN_NATIVE_AD'

    static CLOSE_NATIVE_AD: string = 'CLOSE_NATIVE_AD'

    // static FORCE_CLOSE: boolean = false;

    protected static hideBannerCount: number = 0;


    static isBannerState() {
        return this.hideBannerCount <= 0
    }

    static setBannerState(f: boolean) {
        if (!CMgr.helper.isVersion()) {
            return false;
        }
        if (!f) {
            this.hideBannerCount++;
            GEvent.instance().emit(this.OPEN_NATIVE_AD)
        } else {
            this.hideBannerCount--;
            if (this.hideBannerCount <= 0) {
                this.hideBannerCount = 0;
                GEvent.instance().emit(this.CLOSE_NATIVE_AD)
            }
        }
    }
}