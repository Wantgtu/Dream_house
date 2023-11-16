import { XlsxData } from "../../cfw/xlsx";
import { ModuleManager } from "../../cfw/module";
import LangManager from "../../cfw/tools/LangManager";


export default class UIText {

    private static ins: UIText;

    static instance() {
        if (!this.ins) {
            this.ins = new UIText()
        }
        return this.ins;
    }

    private uiData: XlsxData;

    constructor() {
        this.uiData = ModuleManager.dataManager.get('UITextModel')
    }

    getText(id: any, opt?) {
        let content = this.uiData.getValue(id, 0);
        // console.log(' content ', content)
        return LangManager.instance().getLocalString(content, opt)
    }
}
