import { BaseView } from "../../../cfw/view";
import GameTipMgr from "../model/GameTipMgr";
import GameTipModel from "../model/GameTipModel";
import CloseGameTip from "../model/CloseGameTip";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameTipView extends BaseView {
    @property(cc.Node)
    tipNode: cc.Node = null;

    @property(cc.Label)
    tipContent: cc.Label = null;

    protected model: GameTipMgr;
    private count: number = 0
    start() {
        this.node['_hitTest'] = this.hitTest.bind(this)
        // this.setModel(GameTipMgr.instance())
        // this.eventProxy.on(GameTipMgr.SHOW_TIP, this.showTip, this)
        // this.eventProxy.on(GameTipMgr.CLOSE_TIP, this.closeTip, this)
        GameTipMgr.instance().on(GameTipMgr.STAT_TIP, this.startTip, this)
        CloseGameTip.instance().on(CloseGameTip.CLOSE_TIP, this.closeTip, this)
        // this.eventProxy.on(GameTipMgr.CLOSE_TIP, this.closeTip, this)
        // cc.tween(this.node).delay(0.2)
        //     .call(() => {
        //         this.count++;
        //     })
        //     .start();
        this.init();
        this.startTip(GameTipMgr.instance().getTipID())
    }
    hitTest(pos: cc.Vec2) {
        // let pos = e.getLocation()
        console.log(' hitTest ==============   ')

        // const element = this.nativeAd.node
        // if (element.active && EngineHelper.isPositionInRect(pos, element.getBoundingBoxToWorld())) {
        //     return true;
        // }
        this.touchStart();

        return false;
    }
    onDestroy() {
        super.onDestroy();
        GameTipMgr.instance().off(GameTipMgr.STAT_TIP, this.startTip, this)
        CloseGameTip.instance().off(CloseGameTip.CLOSE_TIP, this.closeTip, this)
    }

    startTip(id: number) {
        console.log('startTip id ', id)
        let m = GameTipMgr.instance().getGameTipModel(id)
        if (m) {
            if (this.count > 0) {
                // GameTipMgr.instance().emit(GameTipMgr.SHOW_TIP, this, id)
                this.showTip(m)
            } else {
                // cc.tween(this.node).delay(0.2)
                //     .call(() => {
                this.showTip(m)
                // })
                // .start();
            }
        }




    }

    showTip(item: GameTipModel) {
        this.tipContent.string = item.getContent();
        let size = cc.view.getVisibleSize();
        // console.log(' size ',size,' x ',item.getX(),item.getY())
        let pos = cc.v2(item.getX() * size.width, item.getY() * size.height)
        // console.log(' pos ',pos)
        this.tipNode.setPosition(pos)
        this.tipNode.active = true;
        console.log(' item.getIsSkip() ', item.getIsSkip())
        if (item.getIsSkip() == 0) {
            this.setTouchEnable(true)
        } else {
            this.setTouchEnable(false)
            GameTipMgr.instance().finish();
        }

    }

    closeTip() {
        this.init();
        CloseGameTip.instance().finish();
    }

    init() {
        this.tipNode.active = false;
        this.setTouchEnable(false)
    }

    touchStart() {
        this.init();
        console.log(' touchStart ')
        GameTipMgr.instance().finish();

    }

    setTouchEnable(flag: boolean) {
        if (!flag) {

            this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this)


        } else {

            this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)



        }
    }


}