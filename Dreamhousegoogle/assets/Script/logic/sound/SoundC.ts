import { BaseController } from "../../cfw/mvc";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import SoundMgr from "./model/SoundMgr";
import UIManager from "../../cfw/ui";


export default class SoundC extends BaseController {
    intoLayer() {
        // if (UIManager.instance().hasView('SettingView', UIIndex.STACK)) {
        //     return;
        // }
        ViewManager.pushUIView({
            path: 'prefabs/SettingView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            model: SoundMgr.instance(),
            controller: this,
        })
    }
}