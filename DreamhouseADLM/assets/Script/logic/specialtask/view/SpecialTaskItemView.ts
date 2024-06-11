import { BaseItemView } from "../../../cfw/view";
import SpecialTaskItemModel from "../model/SpecialTaskItemModel";
import { ItemState, BaseItemModel } from "../../../cfw/model";
import { ModuleID } from "../../../config/ModuleConfig";


const { ccclass, property } = cc._decorator;

@ccclass
export default class SpecialTaskItemView extends BaseItemView {

    @property({ type: cc.Sprite, displayName: "starPointSprite" })
    starPointSprite: cc.Sprite = null;

    @property({ type: cc.Sprite, displayName: "circlePointSprite" })
    circlePointSprite: cc.Sprite = null;

    @property({ type: cc.Sprite, displayName: "CheckSprite" })
    CheckSprite: cc.Sprite = null;

    @property({ type: cc.Sprite, displayName: "pointSprite" })
    pointSprite: cc.Sprite = null;

    @property({ type: cc.Sprite, displayName: "itemIconSprite" })
    itemIconSprite: cc.Sprite = null;


    protected model: SpecialTaskItemModel
    onEnter() {
        this.content();
    }

    addListener() {
        //在此之前节点被隐藏了就不会走onDestroy方法了。
        this.eventProxy.on(BaseItemModel.UPDATE_STATE, this.updateState, this)
    }

    // onDestroy() {
    //     super.onDestroy();
    //     console.warn('SpecialTaskItemView onDestroy ')
    // }

    content() {
        if (!this.model) {
            return;
        }
        if (this.model.isLastTask()) {
            this.starPointSprite.node.active = true;
            this.circlePointSprite.node.active = false;
        } else {

            this.starPointSprite.node.active = false;
            this.circlePointSprite.node.active = true;
        }
        this.setSpriteAtlas(this.itemIconSprite, ModuleID.PUBLIC, this.model.getIcon(), this.model.getSpriteFrame())
        this.updateState();
    }

    updateState() {
        // console.log('SpecialTaskItemView update ')
        // console.log('this.model.getState() ', this.model.getState(),this.model.getID())
        switch (this.model.getState()) {
            case ItemState.NOT_GET:
                this.CheckSprite.node.active = false;
                this.pointSprite.node.active = false;
                break;
            case ItemState.ON_GOING:
                this.CheckSprite.node.active = false;
                this.pointSprite.node.active = true;
                break;
            case ItemState.CAN_GET:
                this.showRewardItem(this.itemIconSprite.node)
                this.model.setState(ItemState.GOT)
                break;
            case ItemState.GOT:
                this.CheckSprite.node.active = true;
                this.pointSprite.node.active = false;
                break;
        }
    }
    showRewardItem(node: cc.Node) {
        // this.rewardItem.setModel(item)
        // this.rewardItem.draw();
        // this.rewardItem.node.active = true;
        // this.rewardItem.node.scale = 0;
        let scale = node.scale
        let s2 = scale + 1
        let s3 = s2 + 0.1;
        cc.tween(node).to(0.5, { scale: s2 })
            .delay(0.2)
            .to(0.2, { scale: s3 })
            .to(0.5, { scale: scale })
            .call(() => {
                // this.icon.node.active = false;
            })
            .start();

    }





}