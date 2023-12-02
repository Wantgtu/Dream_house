
import CMgr from "../../channel-ts/CMgr";
import { BaseView } from "../../../cfw/view";

const { ccclass, property, requireComponent } = cc._decorator;


requireComponent(cc.Button)
@ccclass
export default class NativeButtonJump extends BaseView {

    @property(cc.Label)
    label: cc.Label = null;

    @property({
        type: cc.Component.EventHandler,
        displayName: "回调函数"
    })
    //有误触
    callback1 = new cc.Component.EventHandler();

    @property({
        type: cc.Component.EventHandler,
        displayName: "回调函数"
    })
    //没有误触
    callback2 = new cc.Component.EventHandler();


    start() {

        if (CMgr.helper.isOpenNativeErrorClick()) {
            this.label.string = '查看广告'
        } else {
            this.label.string = '点击跳过'
        }

    }

    onButtonClick() {
        if (CMgr.helper.isOpenNativeErrorClick()) {
            this.callback1.emit([])
        } else {
            this.callback2.emit([])
        }
    }


}
