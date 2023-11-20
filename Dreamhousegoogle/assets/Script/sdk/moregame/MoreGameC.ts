import { BaseController } from "../../cfw/mvc";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import MoreGameView from "./MoreGameView";

export default class MoreGameC extends BaseController {


    intoLayer() {
        ViewManager.pushUIView({
            path: "prefabs/MoreGameView",
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            className: MoreGameView,
            controller: this,
            model: null,
            func: () => {
            }
        })
    }
}
