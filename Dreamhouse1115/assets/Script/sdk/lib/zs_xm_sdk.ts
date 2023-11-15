import lc_sdk from "./lc_sdk";
import SDKHelper from "../sdk/SDKHelper";

let URL = 'https://platform.qwpo2018.com/api/list_config/index?apk_id='
export default class zs_xm_sdk extends lc_sdk{
    loadCfg(ok: (result) => void, fail: (err) => void) {
        SDKHelper.sendHttpRequest(URL+this.appId, '', (msg: string, data) => {
            if (msg) {
                fail(msg);
            } else {
                ok(data)
            }
        })
    }
}