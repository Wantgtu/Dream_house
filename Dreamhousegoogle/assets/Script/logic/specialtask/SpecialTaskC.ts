import { BaseController } from "../../cfw/mvc";
import { UIIndex } from "../../config/UIConfig";
import UIManager from "../../cfw/ui";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import SpecialtaskMgr from "./model/SpecialtaskMgr";
import LobbyC from "../lobby/LobbyC";
import { SPECIAL_TASK_OK } from "../../config/Config";
import GameEventAdapter from "../../extention/gevent/GameEventAdapter";


export default class SpecialTaskC extends BaseController {
    intoLayer() {
        // if (UIManager.instance().hasView('SpecialTaskView', UIIndex.STACK)) {
        //     return;
        // }
        if (!SPECIAL_TASK_OK) {
            return
        }

 
        ViewManager.pushUIView({
            path: 'specialtask/prefab/SpecialTaskView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            model: SpecialtaskMgr.instance(),
            controller: this,
        })
    }

    playGame() {
        LobbyC.instance().intoGame()
    }
}