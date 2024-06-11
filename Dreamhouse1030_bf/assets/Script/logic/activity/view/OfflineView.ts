import { BaseView } from "../../../cfw/view";
import ActivityItemModel from "../model/ActivityItemModel";
import ActivityC from "../ActivityC";
import { TimeDisplay } from "../../../cfw/time";
import UIText from "../../../cocos/lang/UIText";
import { ItemState } from "../../../cfw/model";
const { ccclass, property } = cc._decorator;

@ccclass
export default class OfflineView extends BaseView {

    @property(cc.Button)
    public normal: cc.Button = null;

    @property(cc.Button)
    public double: cc.Button = null;

    @property(cc.Label)
    public title: cc.Label = null;

    @property(cc.Label)
    public desc: cc.Label = null;

    @property(cc.Label)
    public tokenNum: cc.Label = null;

    @property(cc.Label)
    public goldNum: cc.Label = null;

    protected model: ActivityItemModel;
    protected controller: ActivityC;

    onEnter() {
        this.model.setState(ItemState.CAN_GET)
        // console.log(' this.model.getName() ', this.model.getName())
        this.title.string = this.model.getName();
        let passTime = this.model.getPassTime();
        this.desc.string = UIText.instance().getText(24, { num: TimeDisplay.getFontString(passTime) })
        this.goldNum.string = '' + this.model.getGoldNum();
        this.tokenNum.string = '' + this.model.getTokenNum();
        // this.registerButtonByNode(this.normal, this.onNormalBtnClick)
        // this.registerButtonByNode(this.double, this.noDoubleBtnClick)
    }

    onNormalBtnClick() {
        this.hide();
        this.controller.getOfflineReward(this.model, 1)
    }

    noDoubleBtnClick() {
        this.controller.getOfflineReward(this.model, 2)
    }

    onDestroy() {
        super.onDestroy()
        if (this.model) {
            this.model.setState(ItemState.NOT_GET)
        }
    }

}