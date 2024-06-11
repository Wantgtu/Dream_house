
import NativeAdItemView from "./NativeAdItemView";
import CMgr from "../../channel-ts/CMgr";
import EngineHelper from "../../../engine/EngineHelper";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NativeSlideError extends cc.Component {
    @property(NativeAdItemView)
    nativeAd: NativeAdItemView = null;


    @property
    isHitTest: boolean = false;
    start() {

        let slide = CMgr.helper.getNativeSlide();
        if (slide) {
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
            if (this.isHitTest) {
                this.node['_hitTest'] = this.hitTest.bind(this)
            }
        }

    }
    hitTest(pos: cc.Vec2) {
        // let pos = e.getLocation()
        // console.log(' hitTest ==============   ')
        if (!this.nativeAd) {
            return;
        }
        const element = this.nativeAd.node
        if (element.active && EngineHelper.isPositionInRect(pos, element.getBoundingBoxToWorld())) {
            return true;
        }

        return false;
    }
    touchMove(t: cc.Touch) {
        if (!this.nativeAd) {
            return;
        }
        let pos = t.getLocationInView()
        // let wpos = this.node.convertToWorldSpaceAR(pos)
        let rect = this.nativeAd.node.getBoundingBoxToWorld();
        let flag = EngineHelper.isPositionInRect(pos, rect)
        console.log('OVNativeAdView touchMove  flag ', flag)
        // console.log(' pos ', pos.x, pos.y, rect.x, rect.y, rect.width, rect.height)
        if (flag) {
            this.nativeAd.onButtonClick()
        }
    }
    // update (dt) {}
}
