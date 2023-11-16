
import CMgr from "../../channel-ts/CMgr";
import { BaseView } from "../../../cfw/view";

const { ccclass, property, requireComponent } = cc._decorator;


requireComponent(cc.Button)
@ccclass
export default class NativeButtonX extends BaseView {
    onLoad() {

        this.node.active = false;
        let time = CMgr.helper.getJumpTime();
        this.setTimeout(() => {
            this.node.active = true;
        }, time)


        if (CMgr.helper.hasNativeTouchSwitch()) {
            this.node.width = 50;
            this.node.height = 50;
        } else {
            this.node.width = 60;
            this.node.height = 60;
        }
    }

}