import { BaseView } from "../../../cfw/view";
import ActivityItemModel from "../model/ActivityItemModel";
import ActivityC from "../ActivityC";
import { TimeDisplay, TimeObserver, TimeManager, CountDownTimer } from "../../../cfw/time";
import { EventName } from "../../../config/Config";
import UIText from "../../../cocos/lang/UIText";
import InstallAppC from "../../../sdk/installapp/InstallAppC";
const { ccclass, property } = cc._decorator;

@ccclass
export default class OnlineView extends BaseView {
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


    @property(cc.Button)
    public hideBtn: cc.Button = null;


    @property(cc.Label)
    public doubleText: cc.Label = null;


    @property(cc.Sprite)
    itemIcon: cc.Sprite = null;


    protected model: ActivityItemModel;
    protected controller: ActivityC;

    protected timer: TimeObserver = new CountDownTimer((t) => {
        // console.log(' t ===============  ', t)
        if (t == 0) {
            this.updateState()
            // this.desc.text = '领奖时间到'
        } else {
            this.desc.string = UIText.instance().getText(26, { num: TimeDisplay.getFontString(t) })
        }


    }, 1)

    onEnter() {
        // this.title.string = this.model.getName();

        TimeManager.instance().add(this.timer)
        this.goldNum.string = '' + this.model.getOnLineGold();
        let item = this.model.getItem();

        if (item) {
            this.setSpriteAtlas(this.itemIcon, item.getModuleID(), item.getIcon(), item.getSpriteFrame())
            this.tokenNum.string = '' + this.model.getOnlineToken();
            this.itemIcon.node.scale = item.getScale()
        }
        // this.tokenNum.string = '' + this.model.getOnlineToken();
        // this.registerButtonByNode(this.normal, this.onNormalBtnClick)
        // this.registerButtonByNode(this.double, this.noDoubleBtnClick)
        // this.registerButtonByNode(this.hideBtn, this.hide)
        this.updateState()
        this.gEventProxy.on(EventName.CLOSE_GAME_VIEW, this.hide, this)
    }

    addListener() {
        this.eventProxy.on(EventName.UPDATE_ONLINE_TIME, this.updateState, this)
    }

    updateState() {
        let passTime = this.model.getTime();
        this.timer.setTime(passTime)
        // let leftTime = this.model.getLeftTime()
        console.log('this.timer.getTime() ', this.timer.getTime())
        if (this.timer.getTime() <= 0) {
            this.doubleText.string = UIText.instance().getText(36)
            this.normal.node.active = true;
            this.desc.string = UIText.instance().getText(42)
        } else {
            this.normal.node.active = false;
            // console.log(' UIText.instance().getText(41) ', UIText.instance().getText(41))
            this.doubleText.string = UIText.instance().getText(41)
            // this.desc.string = '领奖倒计时:' + TimeDisplay.getFontString(this.timer.getTime())
            this.desc.string = UIText.instance().getText(26, { num: this.timer.getTime() })
        }
    }

    onDestroy() {
        super.onDestroy();
        TimeManager.instance().remove(this.timer)
        InstallAppC.instance().intoLayer()
    }

    onNormalBtnClick() {
        this.hide();
        this.controller.getOnlineReward(this.model, 1)
    }

    noDoubleBtnClick() {
        this.controller.getOnlineReward(this.model, 2)
    }
}