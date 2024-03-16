import { BaseView } from "../../../cfw/view";
import CMgr from "../../../sdk/channel-ts/CMgr";
import Utils from "../../../cfw/tools/Utils";
import GiftBoxC from "../GiftBoxC";
import GameEventAdapter from "../../../extention/gevent/GameEventAdapter";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GiftBoxView extends BaseView {
    @property(cc.Node)
    public giftBox: cc.Node = null;
    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    constructor() { super(); }

    onEnable(): void {
    }

    onDisable(): void {
    }
    protected time: number = 0;
    protected controller: GiftBoxC;
    onEnter() {
        this.giftBox.active = false;
        // this.registerButtonByNode(this.giftBox, this.onMouseDown2222)
        let flag = CMgr.helper.isSwtichOpen()

        if (flag) {
            this.startShedule()
        }
    }


    onButtonClick() {
        let flag = CMgr.helper.isSwtichOpen()
        if (!flag) {
            return;
        }
        this.giftBox.active = false;
        if (this.controller) {
            let pos = this.giftBox.parent.convertToWorldSpaceAR(this.giftBox.getPosition())
            this.controller.giftClick(pos)
        }
    }

    startShedule() {
        let time = CMgr.helper.getzs_video_box();
        // console.warn('GiftBoxView startShedule time ', time)
        if (time > 0) {
            cc.tween(this.node).delay(time).call(() => {
                this.endShedule();
            })
                .start();
            // Laya.Tween.to(this, {}, time * 1000, null, Laya.Handler.create(this, this.endShedule))
        }
    }

    endShedule() {
        this.loadAd();
        this.startShedule()
    }

    loadAd() {
        // console.log('this.giftBox.active', this.giftBox.active, GameEventAdapter.instance().isOpen())
        if (GameEventAdapter.instance().isOpen()) {
            return;
        }

        if (!this.giftBox.active) {
            let size = cc.view.getVisibleSize();
            let left = this.giftBox.width / 2
            let right = size.width - left;
            let x = Utils.random(left, right)
            this.giftBox.x = x;
            this.giftBox.y = this.giftBox.height / 2;
            this.giftBox.active = true;
        }
        // this.giftBox.active = true;


    }



    updateLogic() {
        let flag = CMgr.helper.isSwtichOpen()
        if (!flag) {
            return;
        }
        if (!this.giftBox.active) {
            return;
        }
        let size = cc.view.getVisibleSize();
        let dt = 16;
        // this.time += dt;
        // if (this.time >= 50) {
        // this.time = 0;
        let speed = dt * 0.08;
        this.giftBox.y -= speed;

        if (this.giftBox.y < - (size.height + this.giftBox.height / 2)) {
            this.giftBox.active = false;
            // this.loadAd()
        }
        // }

    }
}