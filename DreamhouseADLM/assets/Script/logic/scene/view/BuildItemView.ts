import { BaseItemView } from "../../../cfw/view";
import BuildItemModel from "../model/BuildItemModel";
import GuideMgr from "../../../extention/guide/GuideMgr";
import { SoundID, EventName } from "../../../config/Config";
import SoundMgr from "../../sound/model/SoundMgr";
import SceneC from "../SceneC";
import { ItemState } from "../../../cfw/model";
import { ModuleManager } from "../../../cfw/module";
import SceneItemModel from "../model/SceneItemModel";
import { ResType, ResItem } from "../../../cfw/res";
import Debug from "../../../cfw/tools/Debug";
import FingerManager from "./FingerManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BuildItemView extends BaseItemView {

    protected pos: cc.Node
    protected model: BuildItemModel;
    protected image: cc.Sprite;
    protected controller: SceneC;

    onLoad() {
        // this.setController(SceneC.instance())
        let node = this.node.children[0]
        if (node) {
            this.image = node.getComponent(cc.Sprite)
            let idx = parseInt(this.node.name) - 1;
            this.addButton(this.image.node, idx)
            this.gEventProxy.on(EventName.CHANGE_BUILD_IMG, this.updateBuild, this)
        }

    }

    addListener() {
        // this.eventProxy.on(EventName.UPDATE_BUILD_STATE, this.updateItem, this)
    }

    updateItem() {
        let pos = this.node.children[1]
        // Debug.warn('updateItem  this.model.getState() ', this.model.getState(), this.model.getID())
        switch (this.model.getState()) {
            case ItemState.GOT:
                // FingerManager.instance().add(this)
                // if (pos && pos.children[0])
                //     pos.children[0].destroy()
                break;
            default:

                break;
        }
    }
    content() {
        // this.setController(SceneC.instance())
        let pos = this.node.children[1]
        this.controller.addBuildTag(this.model, pos)
        // this.updateItem()
        this.updateBuild(this.model, this.model.getItem())

    }
    private addButton(node: cc.Node, idx: number) {
        let button = node.addComponent(cc.Button)
        button.transition = cc.Button.Transition.SCALE
        let emit = new cc.Component.EventHandler();
        emit.target = this.node;
        emit.component = "BuildItemView";
        emit.handler = 'onBuildClick'
        emit.customEventData = '' + idx;
        button.clickEvents.push(emit)
    }

    getWorldPos() {
        let pos = this.node.children[1]
        return pos.parent.convertToWorldSpaceAR(pos.getPosition())
    }

    updateBuild(m: BuildItemModel, imgIndex: number) {
        if (this.model == m) {
            if (m.getState() != ItemState.GOT) {

            } else {
                // FingerManager.instance().add(this)
            }

            let icon = m.getItemImage(imgIndex)
            ModuleManager.loadRes(m.getModuleID(), icon, ResType.SpriteFrame, (err, item: ResItem) => {
                if (err || !cc.isValid(this.node)) {
                    return;
                }
                if (this.image)
                    this.image.spriteFrame = item.getRes();
            })
        }
        // let scene:SceneItemModel = element.getSceneModel();
        // let list = scene.getBuildIndexData()
        // let buildIndex = element.getIndex() - 1;
        // let m = list[buildIndex]
        // console.log(' bulidIndex ', buildIndex, ' imgIndex ', imgIndex)
        // if (m) {

        // } else {
        //     // console.warn(' m is null ', imgIndex, buildIndex)
        // }
    }
    onBuildClick(e: cc.Touch, idx: number) {
        if (!this.controller || !this.model) {
            return;
        }
        SoundMgr.instance().playSound(SoundID.sfx_buttonPress)
        // console.log(' onBuildClick idx ', idx);
        // let pos = this.node.children[1]
        // console.log(' sceneView pos ', pos)
        // Debug.log('onBuildClick 111 ')
        this.controller.intoBuildSelect(this.model, this.node)
        GuideMgr.instance().notify('onBuildClick')
        // Debug.log('onBuildClick 222 ')

    }
}