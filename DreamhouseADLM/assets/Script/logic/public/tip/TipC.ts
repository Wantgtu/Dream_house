
import TipModel from "./model/TipModel";
import ToastModel from "./model/ToastModel";
import { BaseController } from "../../../cfw/mvc";
import { ModuleManager } from "../../../cfw/module";
import TipView from "./view/TipView";
import ToastView from "./view/ToastView";
import { ModuleID } from "../../../config/ModuleConfig";
import { UIIndex } from "../../../config/UIConfig";
import LangManager from "../../../cfw/tools/LangManager";
import ViewManager from "../../../cfw/tools/ViewManager";

export default class TipC extends BaseController {


    showTipByLang(langID: string, callback: (r: number) => void, isShowAd: boolean = false) {
        this.intoLayer(LangManager.instance().getLocalString(langID), callback, isShowAd)
    }

    intoLayer(content: string, callback: (r: number) => void, isShowAd: boolean = false) {
        let m = new TipModel(content, callback, isShowAd)
        // this.pushView('tip/prefab/TipView', m, ModuleManager.getLoader(ModuleID.RES), UIIndex.STACK)
        ViewManager.pushUIView({
            path: 'tip/prefab/TipView',
            uiIndex: UIIndex.STACK,
            moduleID: ModuleID.RES,
            model: m,
            controller: this,
        })
    }


    showToastByLang(langID: string, opt?) {
        let text = LangManager.instance().getLocalString(langID, opt);
        this.showToast(text)
    }


    showToast(content: string) {
        // this.pushToast('tip/prefab/ToastView', new ToastModel(content), ModuleManager.getLoader(ModuleID.RES), UIIndex.TOAST)
        ViewManager.pushUIToast({
            path: 'tip/prefab/ToastView',
            uiIndex: UIIndex.TOAST,
            moduleID: ModuleID.RES,
            model: new ToastModel(content),
            controller: this,
        })
    }


}
