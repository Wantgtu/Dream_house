import { BaseController } from "../../cfw/mvc";
import { LocalValue } from "../../cfw/local";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import LobbyC from "../lobby/LobbyC";

export default class StartC extends BaseController {

    protected state: LocalValue
    constructor() {
        super();
        this.state = new LocalValue('StartCState', 0)
    }

    isState(s: number) {
        return this.state.getInt() == s
    }

    intoLayer() {
        ViewManager.pushUIView({
            path: 'prefabs/StartView',
            moduleID: ModuleID.START,
            uiIndex: UIIndex.ROOT,
            controller: this,
        })
    }

    toNext() {
        this.state.setValue(1)
        LobbyC.instance().firstShow();
    }
}