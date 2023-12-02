import { BaseView } from "../../../cfw/view";
import { GameView } from "../../game/view/GameView";
import GridFoodMgr from "../../game/model/GridFoodMgr";
import { LocalList } from "../../../cfw/local";
import GridFoodItemModel from "../../game/model/GridFoodItemModel";
import FoodItemView from "../../game/view/FoodItemView";
import { EventName, FRAME_DURATION } from "../../../config/Config";
import GuideMgr from "../../../extention/guide/GuideMgr";
import { CCPoolManager } from "../../../cocos/ccpool";
import ScaleForever from "../../../cocos/comp/ScaleForever";
import { SplitFrameLoader, TimeManager } from "../../../cfw/time";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuyPropView extends BaseView {

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    finger: cc.Node = null;

    protected gameView: GameView;

    protected props: FoodItemView[] = []
    protected frameLoader: SplitFrameLoader = new SplitFrameLoader(this.splitFrameInit.bind(this), FRAME_DURATION)
    setGameView(gv: GameView) {
        this.gameView = gv;
    }

    splitFrameInit(index: number) {
        let list: LocalList = this.model.getRewardList();
        if (list.size() <= 0 || index < 0 || index >= list.size()) {
            TimeManager.instance().remove(this.frameLoader)
            return;
        }
        const key = list.get(index)
        let model: GridFoodItemModel = GridFoodMgr.instance().getFood(key)
        this.add(model)
    }

    protected model: GridFoodMgr;

    onLoad() {
        this.model = GridFoodMgr.instance();
        this.finger.addComponent(ScaleForever)
        TimeManager.instance().add(this.frameLoader)
        // let list: LocalList = this.model.getRewardList();
        // // console.log('addBuyView list.size()  ', list.size())
        // for (let index = list.size() - 1; index >= 0; index--) {
        //     const key = list.get(index)
        //     let model: GridFoodItemModel = GridFoodMgr.instance().getFood(key)
        //     this.add(model)
        // }
        // this.gEventProxy.on(EventName.ADD_BUY_PROP, this.addProp, this)
    }

    onDestroy(){
        super.onDestroy()
        TimeManager.instance().remove(this.frameLoader)
    }

    addProp(model: GridFoodItemModel) {
        // console.log('BuyPropView addProp  ')
        this.add(model)
    }

    add(model: GridFoodItemModel) {
        // console.log('BuyPropView add  ')
        if (model) {
            // let node = cc.instantiate(this.prefab)
            let node: cc.Node = CCPoolManager.instance().get('FoodItemView', () => {
                return cc.instantiate(this.prefab)
            })
            if (node) {
                node.setPosition(cc.v2(0, 0))
                let comp = node.getComponent(FoodItemView)
                if (comp) {
                    comp.setModel(model)
                    comp.content();
                    this.content.addChild(node)
                    this.props.push(comp)
                }
            }
        } else {
            // console.log('add model is null ')
        }
    }


    onButtonClick() {
        let r = this.props.length - 1;
        if (r < 0 || r >= this.props.length) {
            return;
        }
        let item = this.props[r]
        let pos = null;
        if (this) {
            pos = this.node.convertToWorldSpaceAR(item.node.getPosition())
        }
        let flag = this.gameView.addFoodByGift(item, pos)
        GuideMgr.instance().notify('onButtonClick')
        if (flag) {
            // item.recover()

            GridFoodMgr.instance().deleteRewardFood(item.getID())
            this.props.splice(r, 1)
            if (this.props.length <= 0) {
                this.node.active = false;
            }
        }

    }

    getOrder() {
        return 9
    }

    // update (dt) {}
}
