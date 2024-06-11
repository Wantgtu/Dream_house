import { BaseItemView } from "../../cfw/view";
import GuideEventName from "./GuideEventName";


export default class GuideEventLogic extends BaseItemView {


    onLoad() {
        this.gEventProxy.on(GuideEventName.TOUCH_EVENT, this.guideTouchEvent, this)
        this.gEventProxy.on(GuideEventName.BUTTON_CLICK, this.guideButtonClick, this)
    }

    guideButtonClick(list: string[]) {
        let className = list[0]
        let funcName = list[1]
        let param = list[2]
        if (this.getName() == className) {
            this[funcName].call(this, param)
        }
    }


    guideTouchEvent(list: string, e: cc.Touch) {
        let className = list[0]
        let funcName = list[1]
        // console.log('className ', className, funcName,'this.getName() ',this.getName())
        if (this.getName() == className) {
            // console.log('this[funcName] ', this[funcName])
            this[funcName].call(this, e)
        }
    }
}