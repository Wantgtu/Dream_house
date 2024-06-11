import { BaseView } from "../../../cfw/view";
import ItemMgr from "../model/ItemMgr";
import { ItemID, EventName, RedTipType } from "../../../config/Config";
import MarketC from "../../market/MarketC";
import ItemC from "../ItemC";
import GuideMgr from "../../../extention/guide/GuideMgr";
import SoundC from "../../sound/SoundC";
import RedTipMgr from "../../../extention/redtip/RedTipMgr";
import MarketMgr from "../../market/model/MarketMgr";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MoneyView extends BaseView {

    @property(cc.Label)
    lvLabel: cc.Label = null;

    @property(cc.Label)
    cdLabel: cc.Label = null;


    @property(cc.Label)
    coinLabel: cc.Label = null;

    @property(cc.Label)
    energyLabel: cc.Label = null;

    @property(cc.Label)
    tokenLabel: cc.Label = null;

    @property(cc.Node)
    shopNode: cc.Node = null;

    @property(cc.Node)
    lvNode: cc.Node = null;

    @property(cc.Node)
    goldNode: cc.Node = null;

    @property(cc.Node)
    energyNode: cc.Node = null;

    @property(cc.Node)
    tokenNode: cc.Node = null;

    @property(cc.ProgressBar)
    lvProgress: cc.ProgressBar = null;
    // LIFE-CYCLE CALLBACKS:
    @property(cc.Node)
    setNode: cc.Node = null;
    // onLoad () {}

    protected model: ItemMgr;
    protected controller: ItemC;
    protected move1: number = 0.5;
    protected move2: number = 1;
    protected goldPos: cc.Vec2
    protected tokenPos: cc.Vec2;
    protected enegyPos: cc.Vec2;
    onLoad() {
        MarketMgr.instance();
    }
    start() {
        // this.gEventProxy.on(EventName.UPDATE_ITEM_NUM, this.updateItemNum, this)
        // this.gEventProxy.on(EventName.UPDATE_LEVEL, this.updateLv, this)
        this.gEventProxy.on(EventName.OPEN_MAKET, this.setShopNodeVisible, this)
        // this.gEventProxy.on(EventName.UPDATE_ITEM_NUM, this.updateExp, this)
        // this.updateLv();
        // this.updateExp(ItemMgr.instance().getItemModel(ItemID.EXP));

        // this.updateCoin();
        // this.updateEnergy();
        // this.updateToken();
    }

    // updateItemNum(m: ItemModel, p: cc.Vec2) {
    //     let id = m.getID();
    //     if (id == ItemID.TOKEN) {
    //         this.updateToken();
    //     } else if (id == ItemID.ENERGY) {
    //         this.updateEnergy()
    //     } else if (id == ItemID.GOLD) {
    //         this.updateCoin()
    //     }
    // }

    // updateExp(m: ItemModel) {
    //     if (m.getID() == ItemID.EXP) {
    //         let exp = m.getNum();
    //         let total = LevelMgr.instance().getTotalExp();
    //         this.lvProgress.progress = exp / total;
    //     }

    // }

    // updateLv() {
    // this.lvLabel.string = '' + LevelMgr.instance().getLevel()
    // this.updateExp();
    // }

    // updateCoin() {
    //     this.coinLabel.string = this.model.getItemModel(ItemID.GOLD).getNum()
    // }

    // updateEnergy() {
    //     this.energyLabel.string = this.model.getItemModel(ItemID.ENERGY).getNum()
    // }

    // updateToken() {
    //     this.tokenLabel.string = this.model.getItemModel(ItemID.TOKEN).getNum()
    // }

    onEnergyButtonClick() {
        // this.model.updateCount(ItemID.ENERGY, 100)
        GuideMgr.instance().notify('onEnergyButtonClick')
        this.controller.showBuyEnergyView()
    }

    onTokenButtonClick() {

        // this.model.updateCount(ItemID.TOKEN, 100)
        this.controller.showBuyTokenView(0)
    }

    onShopBtnClick() {
        MarketC.instance().intoLayer()
        // RedTipMgr.instance().removeRedTip(RedTipType.STORE)
        GuideMgr.instance().notify('onShopBtnClick')
    }

    setShopNodeVisible(f: boolean) {
        // let v = f ? 255 : 0
        // this.shopNode.opacity = v;
        // this.lvNode.opacity = v;
        // this.goldNode.opacity = v;
        // this.energyNode.opacity = v;
        // this.setNode.opacity = v;
    }

    onSettingBtnClick() {
        SoundC.instance().intoLayer()
    }



    // update (dt) {}
}
