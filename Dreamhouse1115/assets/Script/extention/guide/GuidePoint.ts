import { BaseItemView } from "../../cfw/view";
import GuideMgr from "./GuideMgr";
import GuideEventName from "./GuideEventName";
import { GEvent } from "../../cfw/event";
import { GuideID } from "./GuideID";
import DMaskNode from "./DMaskNode";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
/**
 * 在不支持handlers的引擎中 可以使用funcList结合GuideEventLogic方式
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class GuidePoint extends BaseItemView {


    @property({ type: cc.Enum(GuideID) })
    id: GuideID = 0;

    @property([cc.Node])
    posList: cc.Node[] = []

    @property(cc.Node)
    maskNode: cc.Node = null;

    @property
    param: string = ''

    @property([cc.Component.EventHandler])
    handlers: cc.Component.EventHandler[] = []


    @property([cc.String])
    funcList: string[] = []


    @property
    tipID: number = 0;

    @property
    itemID: number = -1;

    protected touchs: string[]
    protected touche: string[]
    protected touchm: string[]

    protected model: GuideMgr;
    protected count: number = 0;
    protected dMaskNode: DMaskNode = null;
    isTouchEvent() {
        return this.handlers.length > 1 || this.funcList.length > 1
    }
    start() {
        this.dMaskNode = this.maskNode.getComponent(DMaskNode)
        if (this.funcList[0]) {
            this.touchs = this.funcList[0].split('&')
        }
        if (this.funcList[1]) {
            this.touche = this.funcList[1].split('&')
        }
        if (this.funcList[2]) {
            this.touchm = this.funcList[2].split('&')
        }
        cc.tween(this.node).delay(0.2)
            .call(() => {
                // console.log(' GuidePoint start ')
                this.count++;

            })
            .start();
        if (this.itemID == -1) {
            this.init();
        }

    }

    addListener() {
        this.eventProxy.on(GuideEventName.START + this.id, this.guideStart, this)
    }

    init() {
        this.setModel(GuideMgr.instance())

        // this.eventProxy.on(GuideEventName.FINISH, this.guideFinish, this)

        this.guideStart(this.model.getGuideID())
    }

    // guideFinish() {
    //     if (this.count > 0) {
    //         this.count = 0;
    //     }
    // }

    // guideShow(id: number) {
    //     console.log(' guideShow id ', id)
    //     this.guideStart(id)
    // }


    guideStart(id: number) {
        // console.log('guideStart id =========  this.id ', id, this.id, 'this.count ', this.count)
        if (this.id == id) {
            if (this.dMaskNode) {
                this.dMaskNode.start();
            }
            if (this.count > 0) {

                this.model.emit(GuideEventName.SHOW, this)
            } else {
                cc.tween(this.node).delay(0.2)
                    .call(() => {
                        this.model.emit(GuideEventName.SHOW, this)
                    })
                    .start();
            }

        }
    }

    buttonClick() {
        if (!this.handlers) {
            return;
        }
        let handler = this.handlers[0]
        if (handler) {
            // console.log('GuidePoint buttonClick')
            handler.emit([handler.customEventData])
        } else {
            let func = this.funcList[0]
            if (func) {
                GEvent.instance().emit(GuideEventName.BUTTON_CLICK)
            }
        }
    }

    touchStart(e: cc.Touch) {
        if (!this.handlers) {
            return;
        }
        let handler = this.handlers[0]
        if (handler) {
            handler.emit([e])
        } else {
            if (this.touchs.length > 0) {
                GEvent.instance().emit(GuideEventName.TOUCH_EVENT, this.touchs, e)
            }
        }


    }

    touchEnd(e: cc.Touch) {
        if (!this.handlers) {
            return;
        }
        let handler = this.handlers[1]
        if (handler) {
            handler.emit([e])
        } else {
            if (this.touche.length > 0) {
                GEvent.instance().emit(GuideEventName.TOUCH_EVENT, this.touche, e)
            }
        }

    }

    touchMove(e: cc.Touch) {
        if (!this.handlers) {
            return;
        }
        let handler = this.handlers[2]
        if (handler) {
            handler.emit([e])
        } else {
            if (this.touchm.length > 0) {
                GEvent.instance().emit(GuideEventName.TOUCH_EVENT, this.touchm, e)
            }
        }

    }



    // update (dt) {}
}
