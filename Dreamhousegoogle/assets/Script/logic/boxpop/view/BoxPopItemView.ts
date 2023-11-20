import { BaseItemView } from "../../../cfw/view";
import BoxPopItemModel from "../model/BoxPopItemModel";
import BoxPopC from "../BoxPopC";
import { EventName } from "../../../config/Config";
import ItemModel from "../../item/model/ItemModel";
import BagManager from "../../public/bag/BagManager";
import EngineHelper from "../../../engine/EngineHelper";
import { BaseItemModel } from "../../../cfw/model";
import BoxpopMgr from "../model/BoxpopMgr";
import TweenMgr from "../../../cocos/TweenMgr";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxPopItemView extends BaseItemView {
    @property(cc.Label)
    public label: cc.Label = null;

    @property(cc.Sprite)
    public icon: cc.Sprite = null;

    @property(cc.Sprite)
    public box: cc.Sprite = null;

    @property(cc.Node)
    public adButton: cc.Node = null;


    @property(cc.Node)
    public button: cc.Node = null;
    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0

    constructor() { super(); }
    protected model: BoxPopItemModel
    protected controller: BoxPopC;
    onEnable(): void {
    }

    onDisable(): void {
    }

    onEnter() {
        this.gEventProxy.on(EventName.OPEN_BOX, this.openBox, this)
        this.adButton.active = BoxpopMgr.instance().needAd();
        this.label.node.active = false;
        this.icon.node.active = false;

    }

    openBox(m: BoxPopItemModel) {
        // console.log('openBox ', m)
        if (m == this.model) {
            this.draw(this.model.getItem())
        } else {
            // console.log(' this.controller.used(m) ', this.controller.used(m))
            if (this.controller.used(this.model)) {
                return;
            }
            // console.log(' this.controller.getCount() ', this.controller.getCount())
            if (BoxpopMgr.instance().needAd()) {
                this.adButton.active = true;
            }
        }
    }

    onButtonClick() {
        // PlayGameC.instance().selectGame(this.model)
        this.controller.clickBox(this.model);
    }


    draw(item: BaseItemModel) {
        if (item) {
            this.box.node.active = false
            this.icon.node.active = true;
            this.button.active = false;
            this.icon.node.scale = this.model.getScale() + 0.5;
            console.log('  item.getIcon() ', item.getIcon())
            // this.icon.skin = item.getIcon();
            this.setSpriteAtlas(this.icon, item.getModuleID(), item.getIcon(), item.getSpriteFrame())
            // this.label.node.active = true;
            // this.label.string = '' + item.getNum(false);

            TweenMgr.showRewardItem(this.icon.node, this.model.getScale() + 0.5)
        } else {
            console.warn(' item is null ')
        }

    }

    // showRewardItem(item: BaseItemModel) {
    //     let scale = this.model.getScale() + 0.5;
    //     let s2 = scale + 1
    //     let s3 = s2 + 0.1;
    //     cc.tween(this.icon.node).to(0.5, { scale: s2 })
    //         .delay(0.2)
    //         .to(0.2, { scale: s3 })
    //         .to(0.5, { scale: scale })
    //         .call(() => {
    //             // this.icon.node.active = false;
    //         })
    //         .start();

    // }
}