import { BaseController } from "../../cfw/mvc";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";

export default class LoginC extends BaseController{

    intoLayer(){
        ViewManager.pushUIToast({
            path: 'loading/LoginView',
            moduleID: ModuleID.RES,
            uiIndex: UIIndex.ROOT,
            controller: this,

        }) 
    }
}