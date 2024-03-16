
import { BaseView } from "../../cfw/view";
import ShareController from "./ShareController";
import { EventName } from "../../config/Config";


const { ccclass, property } = cc._decorator;

@ccclass
export default class RecorderView extends BaseView {

    @property(cc.Sprite)
    icon: cc.Sprite = null;

    @property(cc.Label)
    num: cc.Label = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    // protected func: Function;
    protected controller: ShareController;
    start() {
        let item = this.controller.getItem();
        if (item) {
            this.icon.node.scale = item.getScale();
            console.log(' item.getSpriteFrame()', item.getSpriteFrame(), 'itemID ', item.getID(), item.getType(), item.getNum(false))
            this.setSpriteAtlas(this.icon, item.getModuleID(), item.getIcon(), item.getSpriteFrame())
            this.num.string = '' + item.getNum(false)
        }
        this.gEventProxy.on(EventName.CLOSE_GAME_VIEW, this.hide, this)
    }


    onBackBtnClick() {

        this.controller.startRecorder();

        this.hide();
    }





    onButtonClick() {
        this.controller.stopRecorder(this);

    }

}
