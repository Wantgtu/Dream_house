import { BaseView } from "../../cfw/view";
import GuideEventName from "./GuideEventName";
import GuideMgr from "./GuideMgr";
import GuidePoint from "./GuidePoint";
/**
 * 必须保证事件触发前，此界面已经存在
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class GuideView extends BaseView {

    @property(cc.Node)
    public pointer: cc.Node = null;

    @property(cc.Mask)
    mask: cc.Mask = null;

    @property(cc.Node)
    button: cc.Node = null;
    // protected stepList: GuidePoint[];

    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    constructor() { super(); }
    protected step: number = 0;
    protected curPoint: GuidePoint;
    protected model: GuideMgr;
    protected count: number = 0;
    start() {

        this.setModel(GuideMgr.instance())
        // this.stepList = this.node.getComponents(GuidePoint)

        this.eventProxy.on(GuideEventName.UPDATE, this.updateState, this)
        this.eventProxy.on(GuideEventName.SHOW, this.setCurPoint, this)
        this.finish();

    }


    setTouchEnable(point: GuidePoint, flag: boolean) {
        if (!flag) {
            if (point.isTouchEvent()) {
                this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this)
                this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
                this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
                this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)
            } else {
                this.pointer.off(cc.Node.EventType.TOUCH_END, this.buttonClick, this)
            }
        } else {
            if (point.isTouchEvent()) {
                this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
                this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this)
                this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
                this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEnd, this)
            } else {
                this.pointer.on(cc.Node.EventType.TOUCH_END, this.buttonClick, this)
            }

        }
    }

    updateState(param: string) {
        // console.log(' updateState param ', param)
        if (this.curPoint) {
            if (this.curPoint.param == param) {
                this.setTouchEnable(this.curPoint, false)
                this.end();
            }
        } else {

        }
    }

    onDestroy() {
        super.onDestroy();
        this.finish();
    }




    setCurPoint(point: GuidePoint) {
        console.log('setCurPoint ==================== ', this.count)
        if (this.count > 0) {
            return;
        }
        ++this.count
        this.mask.node.setPosition(0, 0)
        this.curPoint = point;
        let posList: cc.Node[] = point.posList;
        if (!this.pointer.active) {
            this.pointer.active = true;
        }
        this.node.addComponent(cc.BlockInputEvents)
        let pos1 = this.changePosition(posList[0])
        let time = 0.3;
        this.pointer.setAnchorPoint(posList[0].getAnchorPoint())
        this.pointer.angle = posList[0].angle
        // console.log('setContent id ', point.id)
        this.pointer.setPosition(pos1)
        cc.Tween.stopAllByTarget(this.pointer)
        this.pointer.scale = 1;
        // console.log(' posList.length ', posList.length)
        this.setTouchEnable(this.curPoint, true)
        if (point.isTouchEvent()) {
            this.button.active = false;
        } else {
            this.button.active = true
        }
        if (posList.length > 1) {
            let pos2 = this.changePosition(posList[1])
            cc.tween(this.pointer).repeatForever(
                cc.tween(this.pointer).to(1, { x: pos2.x, y: pos2.y })
                    .call(() => {
                        this.pointer.setPosition(pos1)
                    })
            ).start()

        } else {

            cc.tween(this.pointer).repeatForever(
                cc.tween(this.pointer).by(time, { scale: 0.1 }).delay(0.1).by(time, { scale: - 0.1 }).delay(0.1)
            ).start();
        }

        let maskNode = point.maskNode;
        if (maskNode) {
            this.mask.node.width = maskNode.width;
            this.mask.node.height = maskNode.height;
            this.mask.node.active = true;
            let pos = this.changePosition(maskNode)
            cc.tween(this.mask.node).to(0.5, { x: pos.x, y: pos.y }).start();
            if (this.button.active) {
                this.button.setPosition(pos)
                this.button.width = maskNode.width;
                this.button.height = maskNode.height;
            }


        }
    }

    buttonClick() {
        console.log('touchEnd ')
        if (this.curPoint) {
            // this.pointer.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this
            this.curPoint.buttonClick()
        }


    }

    touchStart(e: cc.Touch) {
        if (this.curPoint) {
            // this.pointer.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this)
            this.curPoint.touchStart(e)
        }

    }
    touchMove(e: cc.Touch) {
        if (this.curPoint) {
            // console.log(' GuideView touchMove')
            this.curPoint.touchMove(e)
        }
    }

    touchEnd(e: cc.Touch) {
        if (this.curPoint) {
            this.curPoint.touchEnd(e)
        }
    }



    end() {
        --this.count
        this.node.removeComponent(cc.BlockInputEvents)
        this.finish();
        this.model.end();
    }


    finish() {
        this.mask.node.active = false;
        cc.Tween.stopAllByTarget(this.pointer)
        this.pointer.active = false;
        this.button.active = false;

    }
}