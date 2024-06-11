import { BaseItemView } from "../../../cfw/view";
import BuildItemModel from "../model/BuildItemModel";
import { EventName } from "../../../config/Config";
import ItemModel from "../../item/model/ItemModel";
import { ItemState } from "../../../cfw/model";
import RedTipPoint from "../../../extention/redtip/RedTipPoint";
import RedTipView from "../../../extention/redtip/RedTipView";
import Debug from "../../../cfw/tools/Debug";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildTagView extends BaseItemView {

    @property(cc.Label)
    label: cc.Label = null;


    @property(cc.Sprite)
    upImg: cc.Sprite = null;

    @property(cc.Sprite)
    grayImg: cc.Sprite = null;
    // LIFE-CYCLE CALLBACKS:

    @property(RedTipPoint)
    point: RedTipPoint = null;
    // onLoad () {}
    @property(RedTipView)
    pointView: RedTipView = null;


    @property(cc.Node)
    bg: cc.Node = null


    @property(cc.Node)
    finger: cc.Node = null

    protected model: BuildItemModel;


    start() {
        this.content();
        // GEvent.instance().on(EventName.UPDATE_BUILD_STATE, this.updateItem, this)
        this.gEventProxy.on(EventName.UPDATE_TASK_STATE, this.updateItem, this)
    }

    addListener() {
        this.eventProxy.on(EventName.UPDATE_BUILD_COIN, this.updateItem, this)
        this.eventProxy.on(EventName.UPDATE_BUILD_STATE, this.updateItem, this)
    }

    onDestroy() {
        super.onDestroy();
        // GEvent.instance().off(EventName.UPDATE_BUILD_STATE, this.updateItem, this)
    }

    updateItem(m: BuildItemModel) {
        // if (m.getID() == ItemID.GOLD) {
        // if (this.model === m) {
        this.content();
        // }

        // }
    }

    content() {
        this.point.id = this.model.getID();
        this.pointView.updateState()


        let state = this.model.getState()
        // Debug.warn('content  state is ', state, this.model.getID())
        switch (parseInt(state)) {
            case ItemState.NOT_GET:
                this.bg.active = true;
                this.finger.active = false;
                this.upImg.node.active = false;
                this.grayImg.node.active = true;
                break;

            case ItemState.ON_GOING:
                this.bg.active = true;
                this.finger.active = false;
                this.upImg.node.active = false;
                this.grayImg.node.active = false;
                break;
            case ItemState.CAN_GET:
                this.bg.active = true
                this.finger.active = true;
                // RedTipMgr.instance().addRedTip(RedTipType.BUILD_OPEN,this.model.getID())
                this.upImg.node.active = true;
                this.grayImg.node.active = false;
                break;
            case ItemState.GOT:
                this.bg.active = false
                this.finger.active = true;
                break;
        }
        let coin = this.model.getOpenCount();
        let total = this.model.getTotalCount();
        this.label.string = coin + '/' + total;
    }

    // update (dt) {}
}
