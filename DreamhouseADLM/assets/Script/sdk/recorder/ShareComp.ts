
import NormalShareC from "./NormalShareC";
import CMgr from "../channel-ts/CMgr";

const { ccclass, property, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Button)
export default class ShareComp extends cc.Component {

    @property
    adSite: number = 0;

    start() {
        let hasShare = CMgr.helper.hasNormalShare();
        this.node.active = hasShare;
        if (hasShare) {
            this.node.on(cc.Node.EventType.TOUCH_END, this.onButtonClick, this)
        }

    }

    onButtonClick() {
        NormalShareC.instance().intoLayer()
    }

}
