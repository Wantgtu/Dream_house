import PersonItemView from "../../person/view/PersonItemView";
import SpecialtaskMgr from "../model/SpecialtaskMgr";
import { BaseItemView } from "../../../cfw/view";
import SpecialTaskItemModel from "../model/SpecialTaskItemModel";
import { EventName, SPECIAL_TASK_OK } from "../../../config/Config";
import { TimeDisplay } from "../../../cfw/time";
import { ModuleID } from "../../../config/ModuleConfig";
import SpecialTaskC from "../SpecialTaskC";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialBuyView extends BaseItemView {


    @property(cc.Prefab)
    personPrefab: cc.Prefab = null;

    @property(cc.Node)
    personPos: cc.Node = null;

    @property(cc.Label)
    coinNum: cc.Label = null;

    @property(cc.Sprite)
    itemIcon: cc.Sprite = null;

    @property(cc.Label)
    dayTimeLabelLabel: cc.Label = null;
    protected person: PersonItemView;

    protected model: SpecialtaskMgr;

    protected curModel: SpecialTaskItemModel;

    onEnter() {
        this.node.active = false
        if (SPECIAL_TASK_OK) {
            this.setModel(SpecialtaskMgr.instance())
            this.content();
            this.gEventProxy.on(EventName.UPDATE_SPECIAL_GOLD_NUM, this.updateCoinNum, this)
            this.gEventProxy.on(EventName.UPDATE_SPECIAL_TASK_STEP, this.content, this)
            this.gEventProxy.on(EventName.UPDATE_SPECIAL_TASK_TIME, this.updateTime, this)
            this.gEventProxy.on(EventName.CHANGE_SPECIAL_TASK_STATE, this.content, this)
        }



    }
    updateTime(time: number) {
        this.dayTimeLabelLabel.string = TimeDisplay.getFontString(time)
    }

    content() {
        this.node.active = this.model.isOpen();
        if (this.model.isOpen()) {
            this.node.active = true;
            this.curModel = this.model.getCurModel();
            if (!this.person) {
                let node = cc.instantiate(this.personPrefab)
                this.person = node.getComponent(PersonItemView)
                this.personPos.addChild(node)
                // this.person.callback = this.animationFinish.bind(this)
                if (this.person) {
                    this.person.setModel(this.model.getPerson())
                    this.person.content();
                }
            }

            this.updateCoinNum();
            this.setSpriteAtlas(this.itemIcon, ModuleID.PUBLIC, this.curModel.getIcon(), this.curModel.getSpriteFrame())
            this.updateTime(this.model.getLeftTime())
        } else {
            this.node.active = false
        }
    }

    updateCoinNum() {
        if (this.curModel) {
            this.coinNum.string = this.model.getGoldNum() + '/' + this.curModel.getGold();
        }

    }

    // onDestroy(){
    //     super.onDestroy()
    //     console.warn('SpecialBuyView onDestroy ')
    // }


    // update (dt) {}

    onButtonClick() {
        SpecialTaskC.instance().intoLayer()
    }
}
