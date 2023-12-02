import { BaseView } from "../../../cfw/view";
import LuckyspinMgr from "../model/LuckyspinMgr";
import LuckySpinItemModel from "../model/LuckySpinItemModel";
import LuckySpinC from "../LuckySpinC";
import BagManager from "../../public/bag/BagManager";
import SDKManager from "../../../sdk/sdk/SDKManager";
// import CMgr from "../../../sdk/channel-ts/CMgr";
// import OVNativeAdC from "../../../sdk/nativeAd/OVNativeAdC";
import { engine } from "../../../engine/engine";
import ItemView from "../../item/view/ItemView";
import EngineHelper from "../../../engine/EngineHelper";
import ItemModel from "../../item/model/ItemModel";
import { BaseItemModel } from "../../../cfw/model";
import UIText from "../../../cocos/lang/UIText";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LuckySpinView extends BaseView {
    @property(cc.Button)
    backBtn: cc.Button = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Button)
    okBtn: cc.Button = null;


    @property(cc.Sprite)
    angle: cc.Sprite = null;

    @property(cc.Sprite)
    adImg: cc.Sprite = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;
    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    @property([cc.Node])
    itemPos: cc.Node[] = [];

    @property(cc.Label)
    tip: cc.Label = null;

    // @property(cc.Node)
    // nativeAd: cc.Node = null;


    // @property(cc.Node)
    // jumpBtn: cc.Node = null;
    constructor() { super(); }

    protected model: LuckyspinMgr;

    protected state: number = 0;

    protected controller: LuckySpinC;
    protected pos: number = 0;
    // protected isRolling: boolean = false;
    protected rewardItem: ItemView;
    onEnable(): void {
    }

    onDisable(): void {
    }

    onEnter() {
        this.model.reset();
        let list = this.model.getLuckySpinItemModelList();
        for (let index = 0; index < list.length; index++) {
            const element: LuckySpinItemModel = list[index];
            let item = element.getItem();
            let node: cc.Node = engine.instantiate(this.itemPrefab)
            // node.scaleX = 0.5;
            // node.scaleY = 0.5;
            node.anchorX = 0.5
            node.anchorY = 0.5;
            this.itemPos[index].addChild(node)
            let comp: ItemView = node.getComponent(ItemView)
            if (comp) {
                comp.setModel(item)
                comp.draw();
                comp.label.string = element.getWeight() + '%'
            }
        }
        this.updateButton();
        let node = engine.instantiate(this.itemPrefab)
        this.node.addChild(node)
        this.rewardItem = node.getComponent(ItemView)
        node.active = false;
        // if (CMgr.helper.hasNativeLimit()) {
        //     let num = CMgr.helper.getzs_native_change_switch();
        //     console.log('updateState num', num)
        //     if (num == 0) {
        //         if (this.nativeAd)
        //             this.nativeAd.active = true;
        //     } else {
        //         OVNativeAdC.instance().intoLayer()
        //     }
        // }
    }

    addListener() {
        this.eventProxy.on(LuckyspinMgr.NOTIFY_RESULT, this.notifyResult, this)
    }

    notifyResult() {
        let result: LuckySpinItemModel = this.model.getResult();
        if (result) {
            // this.isRolling = true;
            this.state = 1;
            let n = 6;
            this.content.angle = 0;
            cc.tween(this.content).to(3, { angle: 360 * n })
                .call(() => {
                    this.spinFinish(result)
                })
                .start();

            // , 3000, null, Laya.Handler.create(this, this.spinFinish, [result]))
        }

    }

    spinFinish(result: LuckySpinItemModel) {
        let to = result.getIndex();
        let final = to + this.itemPos.length
        let per = 360 / this.itemPos.length
        cc.tween(this.content).to(1, { angle: this.content.angle + per * final })
            .call(() => {
                this.spinOver(result)
            })
            .start();
        // , 1000, null, Laya.Handler.create(this, this.spinOver, [result]))
    }

    spinOver(result: LuckySpinItemModel) {
        this.state = 0
        this.controller.addItem(result)
        // BagManager.instance().updateItem(result.getItem(), EngineHelper.getMidPos())
        this.updateButton();
        // this.isRolling = false;
        this.showRewardItem(result.getItem())
    }

    showRewardItem(item: BaseItemModel) {
        this.rewardItem.setModel(item)
        this.rewardItem.draw();
        this.rewardItem.node.active = true;
        this.rewardItem.node.scale = 0;
        cc.tween(this.rewardItem.node).to(0.5, { scale: 2 })
            .delay(1)
            .to(0.2, { scale: 2.1 })
            .to(0.5, { scale: 0 })
            .call(() => {
                this.rewardItem.node.active = false;
            })
            .start();

    }

    updateButton() {
        let flag = this.model.needAd();
        console.log("updateState flag ", flag)
        this.adImg.node.active = flag;
        let next: LuckySpinItemModel = this.model.getNextModel();
        if (!next) {
            this.tip.node.active = false;
        } else {
            let item = next.getItem();
            let nextCount = next.getCount() - this.model.getCount();
            this.tip.node.active = true;
            this.tip.string = UIText.instance().getText(54, { num: nextCount, name: item.getName() })
        }
        // if (flag) {
        //     console.log('CMgr.helper.hasNativeLimit() ', CMgr.helper.hasNativeLimit())

        //     if (CMgr.helper.hasNativeLimit()) {
        //         let num = CMgr.helper.getzs_native_change_switch();
        //         console.log('updateState num', num)
        //         if (num == 0) {
        //             this.jumpBtn.active = true;
        //         } else {
        //             // OVNativeAdC.instance().intoLayer()
        //         }
        //     }

        // }
    }



    onBackBtnClick() {
        // if (this.state != 0) {
        //     return;
        // }
        this.hide();
    }

    onBtnClick() {
        if (this.state != 0) {
            return;
        }
        this.controller.onOkClick(this.model)
    }
}