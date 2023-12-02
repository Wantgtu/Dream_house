import { BaseView } from "../../../cfw/view";
import DialogMgr from "../model/DialogMgr";
import DialogItemModel from "../model/DialogItemModel";
import DialogItemView from "./DialogItemView";
import SoundMgr from "../../../logic/sound/model/SoundMgr";
import { SoundID } from "../../../config/Config";

// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class DialogView extends BaseView {

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    button: cc.Node = null;

    @property(cc.Prefab)
    prefab: cc.Prefab = null;

    @property(cc.Layout)
    layout: cc.Layout = null;

    protected model: DialogMgr;
    protected list: DialogItemModel[]

    protected step: number = 0;
    start() {
        this.button.active = false;
        this.content.active = false;
        this.setModel(DialogMgr.instance())
        this.eventProxy.on(DialogMgr.DIALOG_START, this.dialogStart, this)
    }

    dialogStart(id: number) {
        let list = this.model.getDialogIndexData(id)
        if (list && list.length > 0) {
            this.list = list;
            this.step = 0;
            this.content.on(cc.Node.EventType.TOUCH_START, this.touchStart, this)
            this.content.active = true;
            this.button.active = false;
            this.addItem(this.step++)

        } else {
            this.model.finish();
        }

    }

    touchStart() {
        if (this.content.active) {
            if (this.step < this.list.length) {
                this.addItem(this.step++)
            }
        }
    }

    addItem(step: number) {
        let item = this.list[step]
        if (item) {
            let temp = 'temp'
            let node = cc.instantiate(this.prefab)
            if (node) {
                SoundMgr.instance().playSound(SoundID.sfx_chatEnter)
                // let children = this.layout.node.children;
                this.layout.node.addChild(node)
                node[temp] = 0;

                // children.splice(0, 0, node)
                this.layout.node.children.sort((a: cc.Node, b: cc.Node) => {
                    // console.log(' b temp ', b[temp], 'a temp ', a[temp])
                    return a[temp] - b[temp]
                })
                for (let index = 0; index < this.layout.node.children.length; index++) {
                    const element = this.layout.node.children[index];
                    element[temp]++;
                }
                // if (this.layout.node.children.length == 1) {
                //     node[temp]++;
                // }
                let comp = node.getComponent(DialogItemView)
                if (comp) {
                    comp.setModel(item)
                    comp.content()
                }
                this.layout['_doLayoutDirty']();
                this.layout.updateLayout()
            }
        }

        if (step == this.list.length - 1) {
            this.button.active = true;
        }
    }

    onContinueClick() {
        if (this.model) {
            this.content.off(cc.Node.EventType.TOUCH_START, this.touchStart, this)
            this.content.active = false;
            this.model.finish();
            SoundMgr.instance().playSound(SoundID.sfx_chatExit)
        }
    }

    // update (dt) {}
}
