import { BaseItemModel } from "../../../cfw/model";
import { BaseItemView } from "../../../cfw/view";
import { ModuleID } from "../../../config/ModuleConfig";
const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemView extends BaseItemView {
    @property(cc.Label)
    public label: cc.Label = null;

    @property(cc.Sprite)
    public icon: cc.Sprite = null;


    // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    protected model: BaseItemModel;

    draw() {
        // this.icon.skin = this.model.getIcon();
        // let fs = this.model.getSpriteFrame();
        // if (fs) {
        this.setSpriteAtlas(this.icon, this.model.getModuleID(), this.model.getIcon(), this.model.getSpriteFrame())
        // } else {
        //     this.setSpriteFrame(this.icon, this.model.getModuleID(), this.model.getIcon())
        // }

        this.label.string = '' + this.model.getNum(false)
        this.node.scale = this.model.getScale()
        // console.log('this.model.getScale()', this.model.getScale())
        // let scale = this.model.getScale() * 2;
        // this.icon.node.scale = scale
        // this.icon.node.width = this.icon.node.width * scale;
        // this.icon.node.height = this.icon.node.height * scale
    }
}