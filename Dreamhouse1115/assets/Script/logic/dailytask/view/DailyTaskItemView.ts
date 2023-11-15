// import { ui } from "../../../ui/layaMaxUI";
import DailyTaskItemModel from "../model/DailyTaskItemModel";
import DailyTaskC from "../DailyTaskC";
// import { EngineHelper } from "../../../engine/engine";
import Utils from "../../../cfw/tools/Utils";
// import LayaProgressHBar from "../../../laya/comps/LayaProgressHBar";
import { ItemState, BaseItemModel } from "../../../cfw/model";
import { ItemID } from "../../../config/Config";
import { BaseItemView } from "../../../cfw/view";
import EngineHelper from "../../../engine/EngineHelper";
import UIText from "../../../cocos/lang/UIText";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DailyTaskItemView extends BaseItemView {
    @property(cc.Label)
    titleLabel: cc.Label = null;

    @property(cc.Label)
    redLabel: cc.Label = null;
    @property(cc.Label)
    goodName: cc.Label = null;
    @property(cc.Label)
    percent: cc.Label = null;
    @property(cc.Label)
    stateLabel: cc.Label = null;

    @property(cc.Button)
    redBtn: cc.Button = null;
    @property(cc.Button)
    buyBtn: cc.Button = null;

    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;

    @property(cc.Sprite)
    goldIcon: cc.Sprite = null;

    @property(cc.Sprite)
    tokenIcon: cc.Sprite = null;

    @property(cc.Label)
    numLabel: cc.Label = null;



    protected model: DailyTaskItemModel;
    protected controller: DailyTaskC;

    protected pos: cc.Vec2;
    onLoad() {
        super.onLoad();

    }

    addListener() {
        this.eventProxy.on(BaseItemModel.UPDATE_STATE, this.content, this)
    }



    content() {
        this.titleLabel.string = this.model.getName()
        let desc = this.model.getDesc()
        let total = this.model.getCount()
        let cur = this.model.getCurCount();
        // console.log(' cur ', cur, total)
        this.goodName.string = Utils.replaceOpt(desc, { num: total });
        let percent = cur / total;
        // console.log(' percent ', percent)
        this.progressBar.progress = percent;
        this.percent.string = cur + '/' + total
        let item = this.model.getItem();
        if (item.getID() == ItemID.ENERGY) {
            this.goldIcon.node.active = true;
            this.tokenIcon.node.active = false;
        } else {
            this.goldIcon.node.active = false;
            this.tokenIcon.node.active = true;
        }
        this.numLabel.string = '' + item.getNum(false)
        let state = this.model.getState();
        switch (state) {
            case ItemState.NOT_GET:
                this.redLabel.string = UIText.instance().getText(13)
                this.redBtn.node.active = true;
                this.buyBtn.node.active = false;
                break;
            case ItemState.CAN_GET:
                this.stateLabel.string = UIText.instance().getText(14)
                this.redBtn.node.active = false;
                this.buyBtn.node.active = true;
                break;
            case ItemState.GOT:
                this.redLabel.string = UIText.instance().getText(15)
                this.redBtn.node.active = true;
                this.buyBtn.node.active = false;
                break;
        }
    }

    onBtnClick() {
        if (this.controller) {
            if (!this.pos) {
                this.pos = EngineHelper.getGlobalPos(this.goldIcon.node)
            }
            this.controller.buyClick(this.model, this.pos)
            this.content();
        }
    }
}