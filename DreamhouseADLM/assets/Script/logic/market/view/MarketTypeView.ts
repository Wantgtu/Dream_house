import { BaseView } from "../../../cfw/view";
import MarketTypeModel from "../model/MarketTypeModel";
import MarketMgr from "../model/MarketMgr";
import MarketC from "../MarketC";
import { TimeHelper, TimeDisplay } from "../../../cfw/time";
import MarketItemModel from "../model/MarketItemModel";
import { EventName } from "../../../config/Config";
import MarketItemView from "./MarketItemView";
import CMgr from "../../../sdk/channel-ts/CMgr";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MarketTypeView extends BaseView {

    @property
    type: number = 0;

    @property({ type: cc.Label, displayName: "typeTitleLabel" })
    typeTitleLabel: cc.Label = null;

    @property({ type: cc.Layout, displayName: "typeLayoutLayout" })
    typeLayoutLayout: cc.Layout = null;

    @property({ type: cc.Label, displayName: "typeRefreshTimeLabel" })
    typeRefreshTimeLabel: cc.Label = null;

    @property(cc.Prefab)
    prefabs: cc.Prefab = null;


    protected model: MarketTypeModel;
    protected controller: MarketC;
    protected itemList: MarketItemView[] = []
    onLoad() {
        if (CMgr.helper.marketHasType(this.type)) {
            this.setModel(MarketMgr.instance().getMarketTypeModel(this.type))
            this.setController(MarketC.instance())
            this.updateTime();
            this.updateItems()
        } else {
            this.node.active = false;
        }


    }

    addListener() {
        this.eventProxy.on(EventName.UPDATE_FOOD_LIST, this.updateItems, this)
    }

    updateItems() {
        let list: MarketItemModel[] = MarketMgr.instance().getMarketList(this.type)
        if (list) {
            for (let j = 0; j < list.length; j++) {
                const model: MarketItemModel = list[j];
                // let typeModel: MarketTypeModel = model.getTypeModel();
                // let prefabIndex = parseInt(typeModel.getPrefab());
                // console.log('prefabIndex ', prefabIndex)
                let prefab = this.prefabs
                if (prefab) {
                    let comp = this.itemList[j]
                    if (!comp) {
                        let node = cc.instantiate(prefab)
                        comp = node.getComponent(node.name)
                        this.itemList[j] = comp
                        this.typeLayoutLayout.node.addChild(node)
                    }
                    if (comp) {
                        comp.setModel(model)
                        comp.setController(this.controller)
                        comp.content();
                    }
                } else {
                    // console.log(' prefab is null ')
                }
            }
        }
    }

    updateTime() {
        if (!this.typeRefreshTimeLabel) {
            return;
        }
        let element = this.model;
        if (element && element.getRefreshTime() > 0) {
            // console.log(' (element.getTime() ', element.getTime())
            let time = TimeHelper.leftTime(element.getTime())
            if (time <= 0) {
                element.resetTime();
                time = element.getTime();
            }
            let dis = TimeDisplay.getFontString(Math.floor(time / 1000))
            // console.log('dis', dis)
            this.typeRefreshTimeLabel.string = dis;
        }
    }
}