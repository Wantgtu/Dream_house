import { BaseController } from "../../cfw/mvc";
import ViewManager from "../../cfw/tools/ViewManager";
import { ModuleID } from "../../config/ModuleConfig";
import { UIIndex } from "../../config/UIConfig";
import SceneMgr from "./model/SceneMgr";
import SceneItemModel from "./model/SceneItemModel";
import { BundleManager } from "../../cfw/module";
import { ResType } from "../../cfw/res";
import LoadingC from "../public/loading/LoadingC";
import { LocalValue } from "../../cfw/local";
import { ItemID } from "../../config/Config";
import BuildItemModel from "./model/BuildItemModel";
import UIManager from "../../cfw/ui";
import { ItemState } from "../../cfw/model";
import { RedTipType, DailyTaskID, EventName } from "../../config/Config";
import DailyTaskMgr from "../dailytask/model/DailyTaskMgr";
import { GEvent } from "../../cfw/event";
import RedTipMgr from "../../extention/redtip/RedTipMgr";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


export default class SceneC extends BaseController {

    protected model: SceneItemModel;

    protected curID: number = 0;
    constructor() {
        super();
    }



    protected callback: Function;
    intoLayer(parent: cc.Node, id: number = SceneMgr.instance().getCurID(), func?: Function) {
        if (this.curID == id) {
            return;
        }
        this.callback = func;
        this.curID = id;
        SceneMgr.instance().setSceneID(id)
        // console.log('SceneC intoLayer id ==========  ', id)
        let model: SceneItemModel = SceneMgr.instance().getSceneItemModel(id)
        this.model = model;
        let bundleName = model.getBundle()
        if (!bundleName) {
            return;
        }
        let flag = BundleManager.instance().hasBundle(bundleName)
        // console.log('SceneC flag ', bundleName, flag, ' model ', model)
        if (flag) {
            this.showView(model, parent)
        } else {
            LoadingC.instance().addItem(bundleName, ResType.AssetBundle, ModuleID.RES, 'Load ' + bundleName + ' bundle')
            LoadingC.instance().intoLayer(() => {

                this.showView(model, parent)
            }, UIIndex.AD_LAYER)
        }

    }

    private showView(model: SceneItemModel, parent: cc.Node) {
        // console.log(' model.getBundle() ', model.getBundle())
        ViewManager.pushUIToast({
            path: 'prefabs/SceneView' + model.getID(),
            moduleID: model.getBundle(),
            uiIndex: UIIndex.ROOT,
            model: model,
            controller: this,
            className: 'SceneView',
            parent: parent,
            func: () => {
                UIManager.instance().popView()
                if (this.callback) {
                    this.callback()
                    this.callback = null;
                }
            }
        })
    }

    addBuildSelectView(model: BuildItemModel, node: cc.Node) {
        ViewManager.pushUIView({
            path: 'prefabs/BuildSelectView',
            moduleID: ModuleID.PUBLIC,
            model: model,
            controller: this,
            uiIndex: UIIndex.STACK,
            // parent: node,
        })
    }

    intoBuildSelect(build: BuildItemModel, parent: cc.Node) {
        // let list = this.model.getBuildIndexData()
        // if (list) {
        // let build = list[buildIndex]
        console.log(' build.getState() ', build.getState())
        if (build.getState() == ItemState.CAN_GET) {
            // let coin = build.getCoin();
            // console.log('BagManager.instance().isEnough(ItemID.GOLD, coin) ', BagManager.instance().isEnough(ItemID.GOLD, coin))
            // if (BagManager.instance().isEnough(ItemID.GOLD, coin)) {
            //     BagManager.instance().updateItemNum(ItemID.GOLD, -coin)
            build.setState(ItemState.GOT)
            RedTipMgr.instance().removeRedTip(RedTipType.BUILD_OPEN, build.getID())
            DailyTaskMgr.instance().updateTaskCount(DailyTaskID.BUILD)
            this.addBuildSelectView(build, parent)
            // if (image && image.children[0])
            //     image.children[0].destroy()
            // } else {
            //     TipC.instance().showToast('Not enough gold')
            // }
        } else if (build.getState() == ItemState.GOT) {
            this.addBuildSelectView(build, parent)
        }

        // }
    }

    selectBulid(m: BuildItemModel) {

    }

    addBuildTag(m: BuildItemModel, pos: cc.Node) {
        ViewManager.pushUIToast({
            path: 'prefabs/BuildTagView',
            moduleID: ModuleID.PUBLIC,
            uiIndex: UIIndex.STACK,
            controller: this,
            model: m,
            parent: pos,
        })
    }
}
