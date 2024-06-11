import { BaseController } from "../../cfw/mvc";
import PrivacyMgr from "./PrivacyMgr";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import PrivacyView from "./view/PrivacyView";
import PrivacyPopView from "./view/PrivacyPopView";
import CMgr from "../channel-ts/CMgr";
import ChannelEvent from "../channel-ts/ChannelEvent";
import { engine } from "../../engine/engine";
let KEY = 'PrivacyViewState'


export default class PrivacyC extends BaseController {

    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    constructor() {
        super();

        ChannelEvent.instance().on(ChannelEvent.LOAD_CONFIG, this.onDataFinish, this)
        this.onDataFinish();
    }

    onDataFinish() {
        PrivacyMgr.instance().init(CMgr.helper.getAppName(), CMgr.helper.getCompany(), CMgr.helper.getEmail(), CMgr.helper.getAddress())
    }


    protected callback: Function;
    intoLayer(func?: Function) {
        console.log('PrivacyC intoLayer ')
        this.callback = func;
        if (func) {
            let v = engine.localStorage.getItem(KEY)
            console.log('PrivacyC v ', v)
            if (v == '1') {
                func()
                return;
            } else {

            }
        }
        func()
        // ViewManager.pushUIView({
        //     path: 'agreement/PrivacyView',
        //     moduleID: ModuleID.RES,
        //     uiIndex: UIIndex.STACK,
        //     className: PrivacyView,
        //     model: PrivacyMgr.instance(),
        //     controller: this
        // })
    }

    ok() {
        engine.localStorage.setItem(KEY, '1')
        if (this.callback) {
            this.callback()
        }
    }

    openAgreementView() {
        PrivacyMgr.instance().setIndex(0)
        this.showPrivacyPopView()
    }

    openEmailView() {
        PrivacyMgr.instance().setIndex(1)
        this.showPrivacyPopView()
    }

    private showPrivacyPopView() {
        ViewManager.pushUIView({
            path: 'agreement/PrivacyPopView',
            moduleID: ModuleID.RES,
            uiIndex: UIIndex.STACK,
            className: PrivacyPopView,
            model: PrivacyMgr.instance(),
            controller: this
        })
    }
}