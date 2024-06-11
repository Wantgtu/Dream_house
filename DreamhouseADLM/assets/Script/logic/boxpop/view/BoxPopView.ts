import { BaseView } from "../../../cfw/view";
import BoxpopMgr from "../model/BoxpopMgr";
import BoxPopItemView from "./BoxPopItemView";
import { engine } from "../../../engine/engine";
import FoodItemModel from "../../game/model/FoodItemModel";
import { EventName } from "../../../config/Config";
import BoxPopC from "../BoxPopC";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BoxPopView extends BaseView {


    @property(cc.Prefab)
    public itemPrefab: cc.Prefab = null;
    @property(cc.Layout)
    layout: cc.Layout = null;

    @property(cc.Sprite)
    specialIcon: cc.Sprite = null;

    @property(cc.Node)
    speNode: cc.Node = null;

    constructor() { super(); }

    onEnable(): void {
    }

    onDisable(): void {
    }
    protected model: BoxpopMgr;
    protected controller: BoxPopC;
    onEnter() {
        // this.back.visible = false;
        // this.speNode.active = false;
        // this.back.on(Laya.Event.MOUSE_UP, this, this.onbackButtonClick)
        let list = this.model.getRandomList()
        let max: FoodItemModel = null;
        for (let index = 0; index < list.length; index++) {
            let model = list[index]
            let item: cc.Node = engine.instantiate(this.itemPrefab)
            let comp: BoxPopItemView = item.getComponent(BoxPopItemView)
            comp.setModel(model)
            comp.setController(this.controller)
            // let pos = Math.floor(index / 3);
            this.layout.node.addChild(item)
            if (model.isSpecial()) {
                console.log(' model.isSpecial() ', model.isSpecial())
                max = model.getItem();
            }
            // if (!max) {
            //     max = prop;
            // } else if (prop.getLevel() > max.getLevel()) {
            //     max = prop;
            // }
        }

        if (max) {
            this.setSpriteAtlas(this.specialIcon, max.getModuleID(), max.getIcon(), max.getSpriteFrame())
        }
        this.gEventProxy.on(EventName.CLOSE_GAME_VIEW, this.hide, this)

        // this.gEventProxy.on(EventName.OPEN_BOX, this.openBox, this)
        // this.openBox()
    }

    // openBox() {
    //     if (this.model.needAd()) {
    //         this.speNode.active = true;
    //     }
    // }

    onbackButtonClick() {
        this.hide();
    }



}