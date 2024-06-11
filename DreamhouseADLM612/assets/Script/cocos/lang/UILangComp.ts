import LangManager from "../../cfw/tools/LangManager";
import { GEvent } from "../../cfw/event";
import UIText from "./UIText";


const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Label)
export default class UILangComp extends cc.Component {


    @property
    uiID: string = '';


    start() {
        this.setText();
        LangManager.instance().on(GEvent.CHANGE_LANG, this.setText, this)
    }

    onDestroy() {
        LangManager.instance().off(GEvent.CHANGE_LANG, this.setText, this)
    }


    setText() {
        let text = this.getComponent(cc.Label)
        if (text) {
            text.string = UIText.instance().getText(this.uiID)
        }
    }

}
