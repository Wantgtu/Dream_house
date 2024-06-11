
import SDKManager from "../sdk/SDKManager";
let URL = 'http://sarsgame.gitee.io/configs/lovehouse/'
export default class lc_sdk {



    private cfg = null;
    protected appId:string = ''
    protected secret: string = ''
    initSdkByConf(opt: { channel: string, appId: string, secret: string}) {
        this.cfg = opt
        this.appId = opt.appId;
        this.secret = opt.secret;
    }

    init(openID: string) {

    }

    login(ok: (openid) => void, fail: (err) => void) {
        ok('')
    }

    loadAd(func: (res: any) => void) {
        func({})
    }

    loadCfg(ok: (result) => void, fail: (err) => void) {
        if (!this.cfg) {
            fail('not initSdkByConf ')
        }
        let url = URL + this.cfg.channel + '.json';
        SDKManager.getChannel().request(url, (err, data) => {
            console.log('err ', err, data)
            if (!err) {
                ok(data)
            } else {
                fail(' data is null ')
            }
        })

    }

    navigate2Mini(data:any, openID:string, success:Function, fail:Function, complete:Function){

    }

}