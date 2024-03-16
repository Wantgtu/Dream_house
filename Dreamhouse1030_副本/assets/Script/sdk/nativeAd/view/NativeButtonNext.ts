
import CMgr from "../../channel-ts/CMgr";
import { BaseView } from "../../../cfw/view";

const { ccclass, property, requireComponent } = cc._decorator;


requireComponent(cc.Button)
@ccclass
export default class NativeButtonNext extends BaseView {

    @property({
        type: cc.Component.EventHandler,
        displayName: "回调函数"
    })
    callback1 = new cc.Component.EventHandler();


    start() {

        this.node.active = CMgr.helper.hasNativeNextLimit();

    }

    onNextClick() {
        this.callback1.emit([])
    }
}