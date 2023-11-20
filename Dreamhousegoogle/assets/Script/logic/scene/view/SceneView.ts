import { BaseView } from "../../../cfw/view";
import { engine } from "../../../engine/engine";
import SceneItemModel from "../model/SceneItemModel";
import BuildItemModel from "../model/BuildItemModel";
import { ModuleManager } from "../../../cfw/module";
import { ResType, ResItem } from "../../../cfw/res";
import SceneC from "../SceneC";
import { GEvent } from "../../../cfw/event";
import { EventName, SoundID, FRAME_DURATION } from "../../../config/Config";
import { ItemState } from "../../../cfw/model";
import GuideMgr from "../../../extention/guide/GuideMgr";
import SoundMgr from "../../sound/model/SoundMgr";
import { SplitFrameLoader, TimeManager } from "../../../cfw/time";
import Debug from "../../../cfw/tools/Debug";
import BuildItemView from "./BuildItemView";
import FingerManager from "./FingerManager";
import SingleScaleForever from "../../../cocos/comp/SingleScaleForever";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class SceneView extends BaseView {


    protected frameLoader: SplitFrameLoader = new SplitFrameLoader(this.splitFrameInit.bind(this), FRAME_DURATION)
    protected bgImg: cc.Node = null;
    // protected image: cc.Sprite[] = []
    // protected nodes: cc.Node[] = []
    protected model: SceneItemModel;
    protected controller: SceneC;
    protected dis: number = 0;
    start() {
        this.setController(SceneC.instance())
        // Debug.warn('SceneView start ')
        this.bgImg = engine.findChild('bgImg', this.node)
        let h = this.bgImg.height;
        engine.setNodeWH(this.bgImg)
        let nh = this.bgImg.height;

        let dis = nh / h;
        this.dis = dis;
        // console.log(' dis ', dis)

        let count = this.bgImg.childrenCount;
        let list = this.model.getBuildIndexData()
        for (let index = 0; index < count; index++) {
            const element = this.bgImg.children[index]
            element.y *= dis;
            let comp = element.getComponent(BuildItemView)
            if (!comp) {
                comp = element.addComponent(BuildItemView)

            }
            let idx = parseInt(element.name) - 1;
            comp.setModel(list[idx])
            comp.setController(this.controller)
        }

        TimeManager.instance().add(this.frameLoader)
    }
    splitFrameInit(index: number) {
        let list = this.model.getBuildIndexData();
        if (list.length <= 0 || index < 0 || index >= list.length) {
            TimeManager.instance().remove(this.frameLoader)
            SingleScaleForever.showFinger()
            return;
        }
        const element = this.bgImg.children[index]
        // element.y *= this.dis;
        let comp = element.getComponent(BuildItemView)
        if (comp) {
            comp.content();
        }

    }


    onDestroy() {
        super.onDestroy();
        // GEvent.instance().off(EventName.CHANGE_BUILD_IMG, this.updateBuild, this)
        TimeManager.instance().remove(this.frameLoader)
        FingerManager.instance().clear()
        SingleScaleForever.clear()

    }
    
    changeBuild() {

    }

   
}
